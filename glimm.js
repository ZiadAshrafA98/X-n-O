/*! glimm 0.4.2 (createShader, playSweep, palettes) | MIT License | (c) Noman Ijaz | npmjs.com/package/glimm */
var G=e=>e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4),z=e=>e<=.0031308?e*12.92:1.055*Math.pow(e,.4166666666666667)-.055,ce=(e,a,t)=>{let n=.4122214708*e+.5363325363*a+.0514459929*t,l=.2119034982*e+.6806995451*a+.1073969566*t,o=.0883024619*e+.2817188376*a+.6299787005*t,u=Math.cbrt(n),r=Math.cbrt(l),d=Math.cbrt(o);return[.2104542553*u+.793617785*r-.0040720468*d,1.9779984951*u-2.428592205*r+.4505937099*d,.0259040371*u+.7827717662*r-.808675766*d]},he=(e,a,t)=>{let n=e+.3963377774*a+.2158037573*t,l=e-.1055613458*a-.0638541728*t,o=e-.0894841775*a-1.291485548*t,u=n*n*n,r=l*l*l,d=o*o*o;return[4.0767416621*u-3.3077115913*r+.2309699292*d,-1.2684380046*u+2.6097574011*r-.3413193965*d,-.0041960863*u-.7034186147*r+1.707614701*d]},O=e=>{let[a,t,n]=ce(G(e[0]),G(e[1]),G(e[2]));return{L:a,C:Math.sqrt(t*t+n*n),H:Math.atan2(n,t)}},$=({L:e,C:a,H:t})=>{let n=a*Math.cos(t),l=a*Math.sin(t),[o,u,r]=he(e,n,l),d=c=>Math.max(0,Math.min(1,c));return[d(z(o)),d(z(u)),d(z(r))]},I=e=>{let a=parseInt(e.replace("#",""),16);return[(a>>16&255)/255,(a>>8&255)/255,(a&255)/255]},de=(e,a,t)=>{let n=a-e;return n>Math.PI&&(n-=2*Math.PI),n<-Math.PI&&(n+=2*Math.PI),e+n*t},fe=(e,a,t)=>{let l=e.C<1e-4?a.H:e.H,o=a.C<1e-4?e.H:a.H;return{L:e.L+(a.L-e.L)*t,C:e.C+(a.C-e.C)*t,H:de(l,o,t)}};function ae(e,a){if(e.length===0)return[];if(e.length===1){let l=$(e[0]);return Array.from({length:a},()=>l)}let t=[],n=e.length;for(let l=0;l<a;l++){let u=l/(a-1)*(n-1),r=Math.min(n-2,Math.floor(u)),d=u-r;t.push($(fe(e[r],e[r+1],d)))}return t}var Y={red:"#FF3D7F",orange:"#FF7A1A",yellow:"#FFD600",green:"#C2FF3D",mint:"#00FFA8",teal:"#00E5D6",cyan:"#1FC8FF",blue:"#2E70FF",indigo:"#7B4FFF",purple:"#D33CFF",pink:"#FF3DC0",brown:"#D8A87B"};var Se=Object.fromEntries(Object.entries(Y).map(([e,a])=>[e,O(I(a))]));function pe(e,a){let t=o=>o[0][0]*(o[1][1]*o[2][2]-o[1][2]*o[2][1])-o[0][1]*(o[1][0]*o[2][2]-o[1][2]*o[2][0])+o[0][2]*(o[1][0]*o[2][1]-o[1][1]*o[2][0]),n=t(e);if(Math.abs(n)<1e-9)return null;let l=o=>e.map((u,r)=>u.map((d,c)=>c===o?a[r]:d));return[t(l(0))/n,t(l(1))/n,t(l(2))/n]}function re(e){let a=e.length,t=.5,n=e.map((f,h)=>h/(a-1)),l=n.map(f=>Math.cos(2*Math.PI*t*f)),o=n.map(f=>Math.sin(2*Math.PI*t*f)),u=l.reduce((f,h)=>f+h,0),r=o.reduce((f,h)=>f+h,0),d=l.reduce((f,h)=>f+h*h,0),c=o.reduce((f,h)=>f+h*h,0),v=l.reduce((f,h,b)=>f+h*o[b],0),T=[[a,u,r],[u,d,v],[r,v,c]],y=f=>{let h=e.map(E=>E[f]),b=h.reduce((E,U)=>E+U,0),P=h.reduce((E,U,k)=>E+U*l[k],0),_=h.reduce((E,U,k)=>E+U*o[k],0),x=pe(T,[b,P,_]);if(!x)return{a:b/a,b:0,d:0};let[S,w,A]=x,L=Math.sqrt(w*w+A*A),C=(Math.atan2(-A,w)/(2*Math.PI)+1)%1;return{a:S,b:L,d:C}},R=y(0),F=y(1),M=y(2);return{a:[R.a,F.a,M.a],b:[R.b,F.b,M.b],c:[t,t,t],d:[R.d,F.d,M.d]}}var oe=(e,a)=>{let t=ae([O(I(e)),O(I(a))],17);return t[0]=I(e),t[t.length-1]=I(a),re(t)};function D(e){if(e.length===0)return oe(Y.indigo,Y.cyan);if(e.length===1)return{a:I(e[0]),b:[0,0,0],c:[1,1,1],d:[0,0,0]};let a=e.map(n=>O(I(n))),t=ae(a,17);return re(t)}var ee={spectrum:{a:[.74,.72,.76],b:[.5,.52,.48],c:[1,1,1],d:[.92,.25,.58]},prism:D(["#00C0E8","#6155F5","#CB30E0"]),berry:D(["#FF2D55","#CB30E0"]),lagoon:D(["#0088FF","#00C0E8","#34C759"]),citrus:D(["#34C759","#FFCC00","#FF8D28"]),azure:D(["#00C0E8","#0088FF","#6155F5"]),ember:D(["#FFCC00","#FF8D28","#FF2D55"])};function ne(e){return e?typeof e=="string"?ee[e]:e:ee.spectrum}var me=`
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`,ge=`
precision mediump float;
uniform vec2 uRes;
uniform float uFeather; // device px faded at the canvas edges, 0 = off
uniform float uTime;
uniform float uProgress;
uniform float uAlpha;
uniform float uBandTight;
uniform float uPosStart;
uniform float uPosEnd;
uniform float uHueShift;
uniform float uDirection; // 0 = horizontal, 1 = vertical
uniform float uWaveAmount;   // 0..2, multiplies edge wave displacement
uniform float uRippleAmount; // 0..2, multiplies vertical ripple intensity
uniform float uWaveSpeed;    // 0..3, multiplies all time-based motion
uniform float uBrightness;   // 0..1.5, scales the band's RGB before composite
uniform float uSwellAmount;  // 0..1, depth/iridescence intensity. 0 = flat band.
uniform float uCurve;        // how far the band's ends trail its middle, in travel-axis UV
uniform float uSpan;         // 0..1, share of the cross axis the band covers, centred
uniform float uCenter;       // where the curve and span centre on the cross axis, in UV
uniform vec3 uPalA;
uniform vec3 uPalB;
uniform vec3 uPalC;
uniform vec3 uPalD;

#define PI 3.14159265359

vec3 pal(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return a + b * cos(2.0 * PI * (c * t + d));
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float axis  = mix(uv.x, uv.y, uDirection);
  float cross = mix(uv.y, uv.x, uDirection);

  float pos = uPosStart + uProgress * (uPosEnd - uPosStart);

  float tw = uTime * uWaveSpeed;

  // One shallow bend keeps the silhouette organic without reading as a
  // wave. It moves less than 0.5% of the viewport and drifts slowly enough
  // to feel shaped rather than animated; richer motion stays inside the
  // foil texture below instead of distorting the band's sides.
  float waveX = sin(cross * 4.2 + tw * 0.08 + 0.3) * 0.004;
  waveX *= uWaveAmount;

  // Curve: the ends trail the middle on a parabola, reaching uCurve at the
  // edges of the span. Span: the band covers only the middle of the cross
  // axis and fades out towards its ends.
  float c = (cross - uCenter) / max(0.5 * uSpan, 0.001);
  float cc = clamp(c, -1.0, 1.0);
  float lag = uCurve * cc * cc;
  float spanMask = uSpan >= 1.0 ? 1.0 : 1.0 - smoothstep(0.45, 1.0, abs(c));

  float d = (axis - pos) - waveX + sign(uPosEnd - uPosStart) * lag;
  float band = exp(-d * d * uBandTight);

  // Analytic slope of the band's pseudo-elevation map along the travel
  // axis only. We deliberately ignore the cross-axis chain-rule term
  // (\u2202waveX/\u2202cross) \u2014 letting the high-frequency edge wobble leak into
  // the normal made iridescence shimmer at the wave's frequency, which
  // read as "too wavy". Keeping the cross slope at zero gives a clean
  // left\u2192right hue sweep that matches the iOS name-drop feel.
  float dhDaxis = -2.0 * d * uBandTight * band;
  vec2 slope;
  slope.x = mix(dhDaxis, 0.0, uDirection);
  slope.y = mix(0.0, dhDaxis, uDirection);

  // Synthesised surface normal. The 0.18 gain controls perceived
  // height \u2014 higher = steeper flanks, more dramatic iridescent shift.
  vec3 N = normalize(vec3(-slope.x * 0.18, slope.y * 0.18, 1.0));

  // Keep a short, faint wake behind the crest, in the travel direction.
  // The old saturating trail tinted the entire revealed page until fade-out.
  float behind = max(-d * sign(uPosEnd - uPosStart), 0.0);
  float trail = smoothstep(0.0, 0.08, behind)
              * (1.0 - smoothstep(0.12, 0.65, behind)) * 0.10;

  float midpointFocus = 4.0 * uProgress * (1.0 - uProgress);
  float halo = exp(-d * d * 2.5) * 0.05 * midpointFocus;
  float intensity = max(band, trail) * spanMask;
  intensity = clamp(intensity + halo * (1.0 - band), 0.0, 1.0);

  // Keep the crest continuous to the viewport edges. A vertical fade here
  // exposes the hard snapshot boundary at the top and bottom of a wipe.
  float vfade = 1.0;

  // Hue rotates with the synthesised normal \u2014 the trick that reads as
  // iOS-name-drop iridescence \u2014 but on a deliberately gentle scale so
  // the foil shift looks calm, not strobing.
  // Ripple changes the foil texture, not the edge geometry. Keeping those
  // responsibilities separate lets the band stay calm while its colour
  // still feels alive.
  float ripple = sin(cross * 12.0 + axis * 3.0 + tw * 0.40)
               * 0.015 * uRippleAmount;
  float t = N.x * 0.12 + N.y * 0.08
          + axis * 0.90 + cross * 0.16
          + ripple + uHueShift + uTime * 0.04;
  // Low-pass the cosine palette across neighbouring samples. This keeps
  // adjacent hues flowing into one another instead of forming hard colour
  // lanes when the surface normal changes around the crest.
  vec3 col = pal(t, uPalA, uPalB, uPalC, uPalD) * 0.50
           + pal(t - 0.18, uPalA, uPalB, uPalC, uPalD) * 0.25
           + pal(t + 0.18, uPalA, uPalB, uPalC, uPalD) * 0.25;
  col *= uBrightness;

  // Fixed key light + camera looking down +z. View-independent because
  // there's no real camera; this gives a stable highlight that travels
  // across the crest as the band moves, instead of one that wobbles with
  // viewport size.
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 L = normalize(vec3(0.35, 0.55, 0.9));
  vec3 H = normalize(L + V);
  float NdotH = clamp(dot(N, H), 0.0, 1.0);
  float NdotV = clamp(dot(N, V), 0.0, 1.0);
  float fresnel = pow(1.0 - NdotV, 3.0);
  float spec    = pow(NdotH, 80.0);

  // Edge fade: as the band's traversal progress nears 0 or 1 (entering or
  // exiting the screen) the band reads at 20% alpha; at midpoint it's at
  // 100%. Softens the band's appearance/disappearance so it doesn't pop
  // into existence at full strength.
  float entryFade = mix(0.2, 1.0, 4.0 * uProgress * (1.0 - uProgress));

  // Body \u2014 palette colour where the band has presence. Premultiplied.
  float bodyA = intensity * vfade * uAlpha * entryFade;
  vec3  bodyPM = col * bodyA;

  // Highlights are emissive \u2014 they add light without occluding the page,
  // gated to the band's body so they only fire on the crest, not the wake.
  float highMask = band * spanMask * vfade * uAlpha * entryFade * uSwellAmount;
  vec3  highEmit = (col * fresnel * 0.55 + vec3(spec) * 1.1) * highMask;
  float highA    = (fresnel * 0.4 + spec * 0.9) * highMask;

  // Fade to nothing at the canvas edges, so a sweep inside a container has

  // no hard border. Off (0) when the canvas fills the viewport.

  vec2 edgeDist = min(gl_FragCoord.xy, uRes - gl_FragCoord.xy);

  float edgeFade = uFeather > 0.0 ? smoothstep(0.0, uFeather, min(edgeDist.x, edgeDist.y)) : 1.0;

  gl_FragColor = vec4(bodyPM + highEmit, min(bodyA + highA, 1.0)) * edgeFade;
}
`,ve=e=>Math.max(.2,Math.sqrt(4.6/Math.max(.1,e))),we=(e,a=.2)=>{switch(e){case"ltr":return{axis:0,posStart:-a,posEnd:1+a};case"rtl":return{axis:0,posStart:1+a,posEnd:-a};case"ttb":return{axis:1,posStart:1+a,posEnd:-a};case"btt":return{axis:1,posStart:-a,posEnd:1+a}}};function be(e={}){if(typeof window>"u")return null;let a=e.canvas??document.createElement("canvas"),t=a.getContext("webgl",{alpha:!0,antialias:!1,premultipliedAlpha:!0});if(!t)return null;let n=(i,g)=>{let p=t.createShader(i);return p?(t.shaderSource(p,g),t.compileShader(p),t.getShaderParameter(p,t.COMPILE_STATUS)?p:(console.error("[glimm] shader compile error:",t.getShaderInfoLog(p)),t.deleteShader(p),null)):null},l=n(t.VERTEX_SHADER,me);if(!l)return null;let o=n(t.FRAGMENT_SHADER,ge);if(!o)return t.deleteShader(l),null;let u=t.createProgram();if(!u)return t.deleteShader(l),t.deleteShader(o),null;if(t.attachShader(u,l),t.attachShader(u,o),t.linkProgram(u),!t.getProgramParameter(u,t.LINK_STATUS))return console.error("[glimm] shader link error:",t.getProgramInfoLog(u)),t.deleteProgram(u),t.deleteShader(l),t.deleteShader(o),null;t.useProgram(u);let r=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,r),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW);let d=t.getAttribLocation(u,"a");t.enableVertexAttribArray(d),t.vertexAttribPointer(d,2,t.FLOAT,!1,0,0);let c=i=>t.getUniformLocation(u,i),v=c("uRes"),T=c("uFeather"),y=c("uTime"),R=c("uProgress"),F=c("uAlpha"),M=c("uBandTight"),f=c("uPosStart"),h=c("uPosEnd"),b=c("uHueShift"),P=c("uDirection"),_=c("uWaveAmount"),x=c("uRippleAmount"),S=c("uWaveSpeed"),w=c("uBrightness"),A=c("uSwellAmount"),L=c("uCurve"),C=c("uSpan"),E=c("uCenter"),U=c("uPalA"),k=c("uPalB"),se=c("uPalC"),ie=c("uPalD");t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA);let m=(i,g,p)=>Math.max(g,Math.min(p,i)),s={progress:0,alpha:0,palette:e.palette??ne(void 0),bandTight:m(e.bandTight??14,.1,200),direction:e.direction??"ltr",waveAmount:m(e.waveAmount??0,0,2),rippleAmount:m(e.rippleAmount??1,0,2),waveSpeed:m(e.waveSpeed??1,0,3),brightness:m(e.brightness??1,0,1.5),swellAmount:m(e.swellAmount??.55,0,1),curve:e.curve??0,span:m(e.span??1,.05,1),center:e.center??.5},le=Math.random()*.4,H=e.feather??"auto",W=0,q=!1,K=()=>{let i=Math.min(window.devicePixelRatio||1,2),g=a.getBoundingClientRect(),p=g.width>=window.innerWidth-1&&g.height>=window.innerHeight-1;q=!p,H==="auto"?W=p?0:Math.min(24,.15*Math.min(g.width,g.height))*i:W=Math.max(0,H)*i},Z=()=>{K();let i=Math.min(window.devicePixelRatio||1,2),g=a.getBoundingClientRect(),p=Math.max(1,Math.round(g.width*i)),X=Math.max(1,Math.round(g.height*i));(a.width!==p||a.height!==X)&&(a.width=p,a.height=X,t.viewport(0,0,p,X))};Z();let Q=new ResizeObserver(Z);Q.observe(a);let ue=performance.now(),B=0,V=!1,J=()=>{if(B=0,V||s.alpha===0)return;let i=(performance.now()-ue)/1e3,g=we(s.direction,q?ve(s.bandTight):.2);t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.uniform2f(v,a.width,a.height),t.uniform1f(T,W),t.uniform1f(y,i),t.uniform1f(R,s.progress),t.uniform1f(F,s.alpha),t.uniform1f(M,s.bandTight),t.uniform1f(f,g.posStart),t.uniform1f(h,g.posEnd),t.uniform1f(P,g.axis),t.uniform1f(_,s.waveAmount),t.uniform1f(x,s.rippleAmount),t.uniform1f(S,s.waveSpeed),t.uniform1f(w,s.brightness),t.uniform1f(A,s.swellAmount),t.uniform1f(L,s.curve),t.uniform1f(C,s.span),t.uniform1f(E,s.center),t.uniform1f(b,le),t.uniform3f(U,s.palette.a[0],s.palette.a[1],s.palette.a[2]),t.uniform3f(k,s.palette.b[0],s.palette.b[1],s.palette.b[2]),t.uniform3f(se,s.palette.c[0],s.palette.c[1],s.palette.c[2]),t.uniform3f(ie,s.palette.d[0],s.palette.d[1],s.palette.d[2]),t.drawArrays(t.TRIANGLE_STRIP,0,4),B=requestAnimationFrame(J)};return{canvas:a,setProgress:i=>{s.progress=m(i,0,1)},setAlpha:i=>{V||(s.alpha=m(i,0,1.5),s.alpha>0?B||(B=requestAnimationFrame(J)):(cancelAnimationFrame(B),B=0,t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT)))},setPalette:i=>{s.palette=i},setBandTight:i=>{s.bandTight=m(i,.1,200)},setDirection:i=>{s.direction=i},setWaveAmount:i=>{s.waveAmount=m(i,0,2)},setRippleAmount:i=>{s.rippleAmount=m(i,0,2)},setWaveSpeed:i=>{s.waveSpeed=m(i,0,3)},setBrightness:i=>{s.brightness=m(i,0,1.5)},setSwellAmount:i=>{s.swellAmount=m(i,0,1)},setCenter:i=>{s.center=i},setFeather:i=>{H=i,K()},getProgress:()=>s.progress,getAlpha:()=>s.alpha,destroy:()=>{V||(V=!0,cancelAnimationFrame(B),Q.disconnect(),t.deleteProgram(u),t.deleteBuffer(r),t.deleteShader(l),t.deleteShader(o))}}}function j(e,a,t,n){let l=r=>3*(1-r)*(1-r)*r*e+3*(1-r)*r*r*t+r*r*r,o=r=>3*(1-r)*(1-r)*r*a+3*(1-r)*r*r*n+r*r*r,u=r=>3*(1-4*r+3*r*r)*e+3*(2*r-3*r*r)*t+3*r*r;return r=>{if(r<=0)return 0;if(r>=1)return 1;let d=r;for(let c=0;c<8;c++){let v=l(d)-r;if(Math.abs(v)<1e-6)break;let T=u(d);if(Math.abs(T)<1e-6)break;d-=v/T}return o(d)}}var te={linear:e=>e,easeOutQuart:e=>1-Math.pow(1-e,4),easeOutCubic:e=>1-Math.pow(1-e,3),easeInCubic:e=>e*e*e,easeInOutCubic:e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,easeOutExpo:e=>e===1?1:1-Math.pow(2,-10*e),easeInOutQuint:e=>e<.5?16*e*e*e*e*e:1-Math.pow(-2*e+2,5)/2,snap:j(1,0,.35,.95),ease:j(.25,.1,.25,1),back:j(.175,.885,.32,1.1)},Ae=e=>e?typeof e=="function"?e:te[e]:te.easeOutQuart,Te=e=>1-Math.pow(1-e,4),Pe=e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2;function xe(e,a={}){let t=N(a.sweepMs,1100,0),n=N(a.outroMs,220,0),l=N(a.midpoint,.56,0,1),o=Ae(a.easing??"ease")??Te,u=N(a.peakAlpha,1,0,1.5);a.palette&&e.setPalette(ne(a.palette)),a.bandTight!==void 0&&e.setBandTight(a.bandTight),a.direction&&e.setDirection(a.direction),a.waveAmount!==void 0&&e.setWaveAmount(a.waveAmount),a.rippleAmount!==void 0&&e.setRippleAmount(a.rippleAmount),a.waveSpeed!==void 0&&e.setWaveSpeed(a.waveSpeed),a.brightness!==void 0&&e.setBrightness(a.brightness),a.swellAmount!==void 0&&e.setSwellAmount(a.swellAmount);let r=!1,d=0,c,v,T,y,R=new Promise(h=>{y=h}),F=new Promise(h=>{v=h}),M=new Promise(h=>{T=h}),f=(h,b)=>new Promise((P,_)=>{c=P;let x=performance.now(),S=()=>{if(r){P();return}try{let w=h===0?1:Math.min(1,(performance.now()-x)/h);b(w),r||w===1?P():d=requestAnimationFrame(S)}catch(w){_(w)}};d=requestAnimationFrame(S)});return(async()=>{let h=e.getProgress(),b=h>=.999?0:Math.max(0,Math.min(1,h));e.setAlpha(u),e.setProgress(b);let P=1-b,_=Math.max(80,t*P),x=!1,S=Promise.resolve(),w=()=>{x=!0,S=Promise.resolve().then(()=>{if(!r)return a.onMidpoint?.()}).then(()=>{}),S.then(v,A=>{console.error("[glimm] midpoint callback failed:",A),v()})};await f(_,A=>{let L=N(o(A),A,0,1),C=b+P*L;e.setProgress(C),!x&&C>=l&&w()}),!r&&(x||w(),await Promise.race([S.catch(()=>{}),R]),!r&&(await f(n,A=>e.setAlpha(u*(1-Pe(A)))),!r&&(e.setProgress(0),a.onComplete?.(),T())))})().catch(h=>{console.error("[glimm] sweep callback failed:",h),r||(e.setAlpha(0),e.setProgress(0))}).finally(()=>{v(),T()}),{midpoint:F,done:M,cancel:()=>{r=!0,cancelAnimationFrame(d),c?.(),y(),v(),T()}}}function N(e,a,t,n=1/0){return Number.isFinite(e)?Math.max(t,Math.min(n,e)):a}export{D as accentChain,oe as accentPair,be as createShader,xe as playSweep};
