// Announces a pushed build to open copies of the game, with an honest
// countdown. Run by .github/workflows/announce.yml.
//
// 1. Says "on its way" at once, aiming at when GitHub's past deploys went live.
// 2. Re-aims as this deploy moves on: when the build job ends, and when the
//    "Deploy to GitHub Pages" step starts. Each estimate comes from how long
//    that same stretch took in recent deploys.
// 3. Watches xando.space every second and says "live" the moment it serves
//    the new version.json, then prints how far off each estimate was.
// Messages go out retained on the relays online play uses:
//   xando/v1/soon   "stamp|push time|expected live time" (seconds)
//   xando/v1/build  "stamp"
import mqtt from "mqtt";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const REPO = process.env.GITHUB_REPOSITORY, SHA = process.env.GITHUB_SHA, TOKEN = process.env.GITHUB_TOKEN;
const V = JSON.parse(readFileSync("version.json", "utf8")).v;
const PUSHED = +execSync("git log -1 --format=%ct").toString().trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const t = s => (s ? Date.parse(s) / 1000 : null);
const now = () => Date.now() / 1000;
const median = a => { const b = a.filter(x => x > 0 && x < 300).sort((x, y) => x - y); return b.length ? b[Math.floor(b.length / 2)] : null; };
const gh = async p => { const r = await fetch(`https://api.github.com/repos/${REPO}${p}`, { headers: { authorization: `Bearer ${TOKEN}`, accept: "application/vnd.github+json" } }); if (!r.ok) throw new Error(`${p}: ${r.status}`); return r.json(); };

// the relays
const relays = ["mqtt://broker.emqx.io:1883", "mqtt://broker.hivemq.com:1883"].map(u => {
  const c = mqtt.connect(u, { connectTimeout: 8000, reconnectPeriod: 2000 }); c.on("error", () => {}); return c;
});
const say = (topic, msg) => Promise.all(relays.map(c => new Promise(res => {
  const go = () => c.publish(topic, msg, { retain: true, qos: 1 }, () => res());
  c.connected ? go() : c.once("connect", go); setTimeout(res, 8000);
})));

// the pages deploy for this push, and its stages
const pagesRun = async () => { const j = await gh(`/actions/runs?head_sha=${SHA}&per_page=20`); return j.workflow_runs.find(r => r.name === "pages build and deployment") || null; };
const stages = async run => {
  const j = await gh(`/actions/runs/${run.id}/jobs`);
  const build = j.jobs.find(x => x.name === "build"), deploy = j.jobs.find(x => x.name === "deploy");
  const step = deploy && deploy.steps.find(s => s.name === "Deploy to GitHub Pages");
  return { created: t(run.created_at), built: build && build.status === "completed" ? t(build.completed_at) : null,
    deploying: step && step.started_at ? t(step.started_at) : null, deployed: step && step.completed_at ? t(step.completed_at) : null };
};

// how long each stretch took in recent deploys (live ~ just before the deploy step ends)
async function history() {
  const j = await gh(`/actions/runs?status=success&per_page=40`).catch(() => ({ workflow_runs: [] }));
  const runs = j.workflow_runs.filter(r => r.name === "pages build and deployment" && r.head_sha !== SHA).slice(0, 10);
  const all = [], afterBuild = [], afterStart = [];
  for (const r of runs) {
    try { const s = await stages(r); if (!s.deployed) continue;
      // the site starts serving about 3 s before GitHub marks the step done (measured)
      const at = s.deployed - 3;
      all.push(at - s.created); if (s.built) afterBuild.push(at - s.built); if (s.deploying) afterStart.push(at - s.deploying);
    } catch {}
  }
  return { all: median(all) ?? 36, afterBuild: median(afterBuild) ?? 14, afterStart: median(afterStart) ?? 7, n: all.length };
}

const live = async () => { try { const r = await fetch(`https://xando.space/version.json?t=${Date.now()}`, { cache: "no-store", headers: { "cache-control": "no-cache" } }); return r.ok && (await r.json()).v === V; } catch { return false; } };

// 1. on its way, aimed by history (from the push until the deploy is found)
let run = null; for (let i = 0; i < 6 && !run; i++) { run = await pagesRun().catch(() => null); if (!run) await sleep(1000); }
const H = await history();
const start = run ? t(run.created_at) : PUSHED;
let eta = Math.round(start + H.all), aimed = [["start", eta]];
console.log(`want ${V}; ${H.n} past deploys: live ${H.all}s after start, ${H.afterBuild}s after build, ${H.afterStart}s after deploy starts`);
await say("xando/v1/soon", `${V}|${PUSHED}|${eta}`);

// 2 + 3. re-aim at each stage, and watch for it to go live
let built = false, deploying = false, liveAt = null;
for (let i = 0; i < 600 && !liveAt; i++) {
  if (await live()) { liveAt = now(); break; }
  if (i % 2 === 0) {
    try {
      if (!run) run = await pagesRun();
      if (run) { const s = await stages(run);
        if (s.deploying && !deploying) { deploying = true; built = true; eta = Math.round(s.deploying + H.afterStart); aimed.push(["deploy started", eta]); await say("xando/v1/soon", `${V}|${PUSHED}|${eta}`); }
        else if (s.built && !built) { built = true; eta = Math.round(s.built + H.afterBuild); aimed.push(["build done", eta]); await say("xando/v1/soon", `${V}|${PUSHED}|${eta}`); }
      }
    } catch (e) { console.log("stage check:", e.message); }
  }
  await sleep(1000);
}
if (!liveAt) { console.log(`the site never served ${V}`); process.exit(1); }
await say("xando/v1/build", V);
console.log(`live ${Math.round(liveAt - PUSHED)}s after the push`);
for (const [what, at] of aimed) console.log(`  aimed at ${what}: off by ${Math.round(liveAt - at)}s`);
relays.forEach(c => c.end(true));
process.exit(0);
