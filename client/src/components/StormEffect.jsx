import { useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   StormEffect – permanent cinematic overlay shown on every page.
   When `intense` is true (prediction made) the rain gets heavier,
   lightning fires more often, and the flood water rises higher.
   All layers are pointer-events:none so the UI below stays interactive.
═══════════════════════════════════════════════════════════════════════════ */

function rnd(a, b) { return a + Math.random() * (b - a); }

/* stable seeded arrays so re-renders don't reshuffle */
function useStable(fn) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(fn, []);
}

/* ── Injected <style> ───────────────────────────────────────────────────── */
function StormStyles() {
  return (
    <style>{`
/* ROOT */
.storm-root{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.storm-layer{position:absolute;inset:0;pointer-events:none;}

/* SKY VIGNETTE */
.storm-sky{
  background:linear-gradient(
    175deg,
    rgba(4,6,20,0.88)  0%,
    rgba(8,14,34,0.72) 40%,
    rgba(6,10,28,0.52) 70%,
    rgba(3,6,18,0.28) 100%
  );
  animation:skyPulse 7s ease-in-out infinite alternate;
}
@keyframes skyPulse{from{opacity:.80}to{opacity:1}}

/* CLOUDS */
.storm-cloud{
  position:absolute;
  background:radial-gradient(ellipse at 40% 50%,#141828 0%,#0b0e1c 55%,rgba(6,8,18,0) 100%);
  border-radius:50%;
  animation:cloudDrift linear infinite;
}
@keyframes cloudDrift{
  0%  {transform:translateX(-80px) scaleX(1)   }
  50% {transform:translateX(50px)  scaleX(1.05)}
  100%{transform:translateX(-80px) scaleX(1)   }
}

/* RAIN */
.rain-drop{
  position:absolute;
  background:linear-gradient(to bottom,rgba(140,190,255,0) 0%,rgba(160,210,255,0.88) 100%);
  transform:rotate(12deg);
  border-radius:0 0 4px 4px;
  animation:rainFall linear infinite;
}
@keyframes rainFall{
  0%  {transform:rotate(12deg) translateY(-5vh);opacity:0  }
  8%  {opacity:1}
  92% {opacity:.85}
  100%{transform:rotate(12deg) translateY(115vh);opacity:0}
}

/* LIGHTNING BOLTS */
.lightning-bolt{
  position:absolute;
  width:3px;
  background:linear-gradient(to bottom,rgba(255,255,220,.95),rgba(200,220,255,.5),transparent);
  border-radius:2px;
  filter:blur(1px) drop-shadow(0 0 8px #fff) drop-shadow(0 0 24px #b0d0ff);
  clip-path:polygon(40% 0%,60% 0%,72% 42%,100% 42%,28% 100%,44% 56%,8% 56%);
  animation:boltFlash ease-in-out infinite;
}
@keyframes boltFlash{
  0%,82%,86%,90%,96%,100%{opacity:0}
  83%,85%,91%,95%         {opacity:1}
}
.lightning-flash{
  position:absolute;inset:0;
  background:rgba(210,230,255,.07);
  animation:screenFlash ease-in-out infinite 4.8s;
}
@keyframes screenFlash{
  0%,80%,84%,88%,100%{opacity:0}
  81%,83%,87%        {opacity:1}
}

/* FLOOD WATER */
.flood-water{
  position:absolute;bottom:0;left:0;right:0;
  background:linear-gradient(to top,
    rgba(3,40,75,.90) 0%,
    rgba(5,65,110,.75) 50%,
    rgba(8,95,150,.30) 100%
  );
  overflow:hidden;
  animation:waterRise 10s ease-out forwards;
}
/* calm mode */
.flood-water.calm{animation:waterRiseCalm 14s ease-out forwards}
@keyframes waterRise    {from{height:0;opacity:.2}to{height:22%;opacity:1}}
@keyframes waterRiseCalm{from{height:0;opacity:.1}to{height:10%;opacity:.8}}

.flood-wave{
  position:absolute;top:-14px;left:-50%;width:200%;height:26px;
  background:rgba(100,180,255,.30);border-radius:50%;
  animation:waveMotion linear infinite;
}
.w1{animation-duration:3.0s;animation-delay:0s}
.w2{animation-duration:4.2s;animation-delay:.7s;top:-7px;background:rgba(80,160,240,.22)}
.w3{animation-duration:5.5s;animation-delay:1.3s;top:0;background:rgba(60,140,220,.16)}
@keyframes waveMotion{
  0%  {transform:translateX(0)    scaleY(1)   }
  50% {transform:translateX(7%)   scaleY(1.18)}
  100%{transform:translateX(0)    scaleY(1)   }
}
.flood-debris{
  position:absolute;background:rgba(35,48,22,.75);border-radius:3px;
  animation:debrisFloat linear infinite;
}
.d1{width:30px;height:8px;bottom:35%;left:12%;animation-duration:6s}
.d2{width:20px;height:5px;bottom:48%;left:52%;animation-duration:7.5s;animation-delay:1s}
.d3{width:42px;height:7px;bottom:22%;left:72%;animation-duration:5.2s;animation-delay:2s}
@keyframes debrisFloat{
  0%  {transform:translateX(0)   rotate(0deg)}
  50% {transform:translateX(35px)rotate(14deg)}
  100%{transform:translateX(0)   rotate(0deg)}
}

/* TREES */
.storm-tree{
  position:absolute;
  display:flex;flex-direction:column;align-items:center;justify-content:flex-end;
  transform-origin:bottom center;
  animation:treeSway ease-in-out infinite alternate;
}
@keyframes treeSway{
  0%  {transform:rotate(-16deg) skewX(-3deg)}
  35% {transform:rotate( 12deg) skewX( 2deg)}
  65% {transform:rotate(-11deg) skewX(-2deg)}
  100%{transform:rotate( 15deg) skewX( 3deg)}
}
/* calm trees sway less */
.storm-tree.calm{animation-name:treeSwayCalm}
@keyframes treeSwayCalm{
  0%  {transform:rotate(-6deg)}
  100%{transform:rotate( 6deg)}
}
.tree-trunk{
  background:linear-gradient(to right,#1e0f06,#2e1a0a,#1e0f06);
  height:33%;border-radius:3px 3px 0 0;
}
.tree-canopy{
  position:absolute;border-radius:50% 50% 40% 40%;
  left:50%;transform:translateX(-50%);
}
.tc1{background:radial-gradient(ellipse,#082206 0%,#041002 72%,transparent 100%);opacity:.94}
.tc2{background:radial-gradient(ellipse,#0a2d07 0%,#051504 72%,transparent 100%);opacity:.88}
.tc3{background:radial-gradient(ellipse,#0d3309 0%,#061806 72%,transparent 100%);opacity:.82}

/* SIDEBAR TREES */
.sidebar-storm-tree{
  position:absolute;
  display:flex;flex-direction:column;align-items:center;justify-content:flex-end;
  transform-origin:bottom center;
  animation:treeSway ease-in-out infinite alternate;
  pointer-events:none;
}
`}</style>
  );
}

/* ── Individual sub-components ─────────────────────────────────────────── */
function Rain({ drops, count }) {
  return (
    <div className="storm-layer">
      {drops.slice(0, count).map((d, i) => (
        <div key={i} className="rain-drop" style={{
          left: `${d.x}%`, top: `${d.y}%`,
          width: `${d.w}px`, height: `${d.len}px`,
          animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s`,
          opacity: d.opacity,
        }} />
      ))}
    </div>
  );
}

function Clouds({ clouds }) {
  return (
    <div className="storm-layer">
      {clouds.map((c, i) => (
        <div key={i} className="storm-cloud" style={{
          width: `${c.w}px`, height: `${c.h}px`,
          top: `${c.top}%`, left: `${c.left}%`,
          animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s`,
          opacity: c.opacity, filter: `blur(${c.blur}px)`,
        }} />
      ))}
    </div>
  );
}

function Lightning({ bolts, intense }) {
  return (
    <div className="storm-layer">
      {bolts.map((b, i) => (
        <div key={i} className="lightning-bolt" style={{
          left: `${b.x}%`, top: `${b.top}%`, height: `${b.h}%`,
          animationDuration: `${intense ? b.dur * 0.6 : b.dur}s`,
          animationDelay: `${b.delay}s`,
        }} />
      ))}
      <div className="lightning-flash" style={{
        animationDuration: intense ? '3.2s' : '4.8s',
      }} />
    </div>
  );
}

function FloodWater({ intense }) {
  return (
    <div className="storm-layer">
      <div className={`flood-water${intense ? '' : ' calm'}`}>
        <div className="flood-wave w1" /><div className="flood-wave w2" /><div className="flood-wave w3" />
        <div className="flood-debris d1" /><div className="flood-debris d2" /><div className="flood-debris d3" />
      </div>
    </div>
  );
}

function Trees({ trees, intense }) {
  return (
    <div className="storm-layer">
      {trees.map((t, i) => (
        <div key={i} className={`storm-tree${intense ? '' : ' calm'}`} style={{
          left: `${t.x}%`, bottom: `${t.bottom}%`,
          width: `${t.w}px`, height: `${t.h}px`,
          animationDuration: `${intense ? t.dur * 0.6 : t.dur}s`,
          animationDelay: `${t.delay}s`,
        }}>
          <div className="tree-trunk" style={{ width: `${t.w * 0.13}px` }} />
          <div className="tree-canopy tc1" style={{ width: `${t.w}px`,       height: `${t.h * .56}px`, bottom: '27%' }} />
          <div className="tree-canopy tc2" style={{ width: `${t.w * .76}px`, height: `${t.h * .44}px`, bottom: '41%' }} />
          <div className="tree-canopy tc3" style={{ width: `${t.w * .52}px`, height: `${t.h * .34}px`, bottom: '55%' }} />
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Exported component
══════════════════════════════════════════════════════════════════════════ */
export default function StormEffect({ intense = false }) {
  /* All random arrays are stable across renders */
  const drops = useStable(() => Array.from({ length: 280 }, () => ({
    x: rnd(0,100), y: rnd(-30,0),
    w: rnd(1,2.3), len: rnd(14,38),
    dur: rnd(0.32,0.72), delay: rnd(0,2.5), opacity: rnd(.42,.88),
  })));

  const clouds = useStable(() => Array.from({ length: 10 }, () => ({
    w: rnd(260,580), h: rnd(80,210),
    top: rnd(-6,24), left: rnd(-12,92),
    dur: rnd(20,48), delay: rnd(0,12),
    opacity: rnd(.72,1), blur: rnd(2,9),
  })));

  const bolts = useStable(() => Array.from({ length: 5 }, () => ({
    x: rnd(8,92), top: rnd(2,14), h: rnd(22,52),
    dur: rnd(5,9), delay: rnd(0,6),
  })));

  const trees = useStable(() => Array.from({ length: 9 }, () => ({
    x: rnd(1,94), bottom: rnd(8,16),
    w: rnd(36,72), h: rnd(78,160),
    dur: rnd(0.38,0.78), delay: rnd(0,.6),
  })));

  const rainCount = intense ? 280 : 140;

  return (
    <>
      <StormStyles />
      <div className="storm-root" aria-hidden="true">
        <div className="storm-layer storm-sky" />
        <Clouds clouds={clouds} />
        <Lightning bolts={bolts} intense={intense} />
        <Rain drops={drops} count={rainCount} />
        <Trees trees={trees} intense={intense} />
        <FloodWater intense={intense} />
      </div>
    </>
  );
}

/* ── Sidebar trees (exported separately for use in DashboardLayout) ──────── */
export function SidebarTrees() {
  const trees = useStable(() => Array.from({ length: 5 }, () => ({
    x: rnd(5, 75), w: rnd(28, 50), h: rnd(55, 110),
    dur: rnd(0.5, 0.9), delay: rnd(0, 0.5),
  })));

  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'220px', overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
      {trees.map((t, i) => (
        <div key={i} className="sidebar-storm-tree" style={{
          left: `${t.x}%`, bottom: 0,
          width: `${t.w}px`, height: `${t.h}px`,
          animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s`,
        }}>
          <div className="tree-trunk" style={{ width: `${t.w * 0.14}px` }} />
          <div className="tree-canopy tc1" style={{ width:`${t.w}px`,      height:`${t.h*.54}px`, bottom:'26%' }} />
          <div className="tree-canopy tc2" style={{ width:`${t.w*.76}px`,  height:`${t.h*.42}px`, bottom:'40%' }} />
          <div className="tree-canopy tc3" style={{ width:`${t.w*.52}px`,  height:`${t.h*.32}px`, bottom:'54%' }} />
        </div>
      ))}
    </div>
  );
}
