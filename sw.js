/* X n O offline worker.
   The game page itself always comes from the network when there is one, so
   a new build shows up at once; with no network the last saved copy opens
   instead, and Same device and Computer play as usual. Everything else the
   game is made of is kept from install and served from here. Fonts are kept
   the first time they load. Online play still needs the internet. */
const V="2026.11.27·2317",CACHE="xno-"+V,FONTS="xno-fonts";
const CORE=["./","site.webmanifest","mqtt.min.js","qr.js","jsqr.js","wave.js","favicon.svg","favicon-32.png","apple-touch-icon.png","icon-192.png","icon-512.png","icon-maskable-512.png"];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("xno-")&&k!==CACHE&&k!==FONTS).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  /* fonts: from the saved copy at once, refreshed in the background */
  if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.open(FONTS).then(async c=>{
      const hit=await c.match(r);
      const net=fetch(r).then(res=>{if(res.ok||res.type==="opaque")c.put(r,res.clone());return res}).catch(()=>hit);
      return hit||net;
    }));return;
  }
  if(u.origin!==location.origin)return;
  /* the version file is the update check: never answered from a cache */
  if(u.pathname.endsWith("/version.json"))return;
  /* the page: network first, the saved copy when offline */
  if(r.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith("/index.html")){
    /* straight from the server, never the browser's own page cache (which
       GitHub lets keep a page for ten minutes). If the address has moved (the
       game moved to its own domain) the app follows it there, rather than
       mistaking the redirect for being offline and showing an old copy */
    e.respondWith(fetch(u.href,{cache:"no-cache",credentials:"same-origin",redirect:"manual"}).then(res=>{
      /* a moved page comes back as a redirect the browser itself then follows */
      if(res.type==="opaqueredirect")return r.mode==="navigate"?res:fetch(r);
      if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put("./",cp))}return res})
      .catch(()=>caches.match("./",{ignoreSearch:true}).then(m=>m||caches.match(r,{ignoreSearch:true}))));
    return;
  }
  /* everything else: saved copy first, network for anything new */
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{
    if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res})));
});
