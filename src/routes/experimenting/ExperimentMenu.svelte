<script lang="ts" context="module">
  export type Choice = { name: string; body: string; section?: string; panel?: string };
</script>
<script lang="ts">
  export let items: Choice[];
  export let onSelect: (index: number) => void;
  export let onActivity: (index: number) => void = () => {};
  export let initialSelection = -1;
  export let persistent = false;
  export let expressive = false;
  export let poster = false;
  let menuNode: HTMLDivElement;
  let highlighted = initialSelection;
  let keyboardMode = false;
  function highlight(index: number, keyboard: boolean) {
    if (highlighted !== index) onActivity(index);
    keyboardMode = keyboard;
    highlighted = index;
  }
</script>

<svelte:window on:focusin={(event) => { if (!persistent && menuNode && !menuNode.contains(event.target as Node)) highlighted = -1; }} />
<div class="choice-menu" class:expressive class:poster bind:this={menuNode}>
  {#each items as item, index}
    <div class="choice-row" class:highlighted={highlighted === index} style:--order={index} on:pointerenter={() => highlight(index, false)} on:pointerleave={() => { if (!persistent && !keyboardMode) highlighted = -1; }} role="group" aria-label={item.name}>
      <button type="button" class="choice" aria-label={item.name} on:focus={() => highlight(index, true)} on:blur={() => { if (!persistent && keyboardMode) highlighted = -1; }} on:click={() => onSelect(index)}>
        <span class="selection-backing" aria-hidden="true"></span>
        <span class="selection-shape" aria-hidden="true"></span>
        <span class="word" data-word={item.name}>{item.name}</span>
        <span class="marker" aria-hidden="true">◂</span>
      </button>
    </div>
  {/each}
</div>

<style>
  .choice-menu { display:grid; gap:7px; }
  .choice-row { position:relative; }
  .choice { position:relative; isolation:isolate; display:flex; align-items:center; gap:16px; width:max-content; max-width:100%; min-width:160px; min-height:64px; padding:8px 18px; border:0; background:transparent; color:var(--scene-paper,#f3fdff); text-align:left; cursor:pointer; touch-action:manipulation; }
  .word { position:relative; text-shadow:none; font-family:var(--font-display); font-weight:900; font-style:italic; font-size:clamp(34px,4.6vw,68px); line-height:.98; letter-spacing:-.015em; white-space:normal; min-width:0; overflow-wrap:anywhere; }
  .selection-shape { position:absolute; z-index:-1; inset:2px -16px 0 -12px; opacity:0; background:#f32949; clip-path:polygon(0 75%,92% 0,100% 100%); transform:translateX(-16px) scaleX(.94); transform-origin:left; }
  .selection-shape::after { content:''; position:absolute; bottom:8px; left:7%; right:13%; height:1px; background:#00154f44; transform:rotate(-2deg); }
  .highlighted .selection-shape { opacity:1; transform:none; animation:engage 210ms var(--ease-menu,ease-out); }
  .highlighted .choice { color:#fff; }
  .highlighted .word { text-shadow:none; transform:translateX(6px); }
  .word { transition:transform 150ms ease-out; }
  .marker { flex-shrink:0; margin-left:auto; font-family:var(--font-ui); font-size:26px; opacity:0; color:var(--scene-ink,#00154f); }
  .highlighted .marker { opacity:1; }
  .choice:focus-visible { outline:2px solid var(--scene-paper,#f3fdff); outline-offset:6px; }
  .choice:active { opacity:.8; }
  @keyframes engage { from { opacity:.3; transform:translateX(-16px) scaleX(.94); } to { opacity:1; transform:none; } }
  @media(max-width:1000px) { .word { font-size:clamp(30px,4.3vw,58px); } }
  @media(max-width:700px) { .word { font-size:clamp(32px,8.5vw,42px); } .choice { min-height:62px; padding:9px 12px; } .choice-menu { gap:6px; } }
  @media(min-width:701px) and (max-height:720px) { .word { font-size:clamp(32px,4.2vw,60px); } .choice { min-height:56px; } .choice-menu { gap:2px; } }
  @media(prefers-reduced-motion:reduce) { .highlighted .selection-shape { animation:none; } .word { transition:none; } }
  .expressive { gap:10px; }
  .expressive .word { font-size:clamp(44px,5.8vw,86px); letter-spacing:-.03em; }
  .expressive .choice-row { transform:rotate(-3deg); }
  .expressive .choice-row:nth-child(2) { transform:rotate(3deg) translateX(14px); }
  .expressive .choice-row:nth-child(3) { transform:rotate(-5deg) translateX(-12px); }
  .expressive .choice-row:nth-child(4) { transform:rotate(5deg) translateX(18px); }
  .expressive .choice-row:nth-child(5) { transform:rotate(-2deg); }
  .expressive .selection-shape { inset:0 -25px -3px -24px; clip-path:polygon(0 88%,97% 0,100% 100%); }
  .expressive .choice-row:nth-child(even) .selection-shape { clip-path:polygon(0 0,100% 25%,9% 100%); }
  .expressive .choice-row:nth-child(3) .selection-shape { clip-path:polygon(5% 100%,80% 0,100% 83%); }
  .expressive .selection-shape::after { inset:0; height:auto; background:#ff9cbe; clip-path:polygon(0 80%,18% 0,29% 69%); transform:none; opacity:.65; }
  .expressive .choice-row:nth-child(even) .selection-shape::after { clip-path:polygon(71% 3%,100% 70%,83% 100%); }
  .expressive .highlighted .word { transform:translateX(6px) scale(1.04); }
  .expressive .choice-row:nth-child(even).highlighted .selection-shape { animation-name:engage-reverse; }
  @keyframes engage-reverse { from { opacity:0; transform:translateX(20px) skewX(-12deg); } to { opacity:1; transform:none; } }
  @media(max-width:1000px) { .expressive .word { font-size:clamp(36px,5.4vw,64px); } }
  @media(max-width:700px) { .expressive .word { font-size:clamp(35px,9vw,46px); } .expressive { gap:9px; } .expressive .choice-row:nth-child(n) { translate:0; } }
  @media(prefers-reduced-motion:reduce) { .expressive .highlighted .selection-shape { animation:none; } }
  .expressive .choice-row:nth-child(3n+1) .word { color:var(--menu-a,var(--scene-cyan)); }
  .expressive .choice-row:nth-child(3n+2) .word { color:var(--menu-b,var(--scene-paper)); opacity:.91; }
  .expressive .choice-row:nth-child(3n) .word { color:var(--menu-c,var(--scene-paper)); opacity:.96; }
  .expressive .word::before { content:attr(data-word); position:absolute; z-index:-1; inset:0; transform:translate(-5px,5px); color:var(--scene-cyan); opacity:.2; }
  .expressive .choice-row:nth-child(even) .word::before { transform:translate(6px,3px); opacity:.14; }
  .expressive .highlighted .word { color:white; opacity:1; }
  .expressive .highlighted .word::before { opacity:0; }
  .choice { transition:translate 170ms cubic-bezier(.2,.8,.2,1); }
  .highlighted .choice { translate:0 -3px; }
  .expressive .word::before { color:var(--scene-ink); opacity:.65; transform:translate(3px,4px); }
  .expressive .choice-row:nth-child(even) .word::before { transform:translate(-3px,4px); opacity:.65; }
  .expressive .selection-shape { background:repeating-linear-gradient(0deg,transparent 0 3px,#ffffff0c 3px 4px),#f32949; clip-path:polygon(0 88%,92% 4%,96% 0,95% 12%,100% 100%,16% 94%,13% 100%); }
  .expressive .choice-row:nth-child(even) .selection-shape { clip-path:polygon(0 0,92% 24%,100% 19%,97% 30%,9% 100%,10% 82%); }
  .expressive .selection-shape::after { background:#ffbed0; opacity:.9; clip-path:polygon(89% 2%,100% 100%,83% 72%); }
  .expressive .choice-row:nth-child(even) .selection-shape::after { clip-path:polygon(0 0,17% 15%,9% 100%); }
  .expressive .highlighted .word::before { opacity:.35; }
  @media(prefers-reduced-motion:reduce) { .choice { transition:none; } .highlighted .choice { translate:none; } }
  .selection-backing { position:absolute; z-index:-2; inset:1px -12px -1px -10px; background:#fff9f0; clip-path:polygon(2% 12%,97% 0,100% 85%,0 100%); opacity:0; transform:translateX(-18px) rotate(3deg); }
  .highlighted .selection-backing { opacity:1; transform:rotate(-2deg); animation:paper-snap 200ms cubic-bezier(.2,.9,.25,1.2); }
  .highlighted .selection-shape { inset:20% -28px 3% -24px; clip-path:polygon(0 90%,100% 0,90% 92%); background:radial-gradient(#00134733 1px,transparent 1.4px) 0 0/5px 5px,#f32949; }
  .highlighted .word,.expressive .choice-row.highlighted .word { color:#061534; text-shadow:none; transform:translateX(5px) skewX(-6deg); animation:type-snap 220ms cubic-bezier(.2,.9,.25,1.2); }
  .expressive .word { font-style:italic; letter-spacing:-.045em; transform:skewX(-5deg); }
  .expressive .word::before { opacity:.18; transform:translate(2px,3px); }
  .expressive .choice-row:nth-child(even) .word::before { opacity:.18; }
  .expressive .choice-row:nth-child(3n+2) .word { opacity:1; }
  .expressive .choice-row:nth-child(3n) .word { opacity:1; }
  .expressive .highlighted .word::before { opacity:0; }
  .expressive .choice-row:nth-child(even) .selection-backing { clip-path:polygon(0 0,100% 11%,96% 100%,3% 89%); }
  .expressive .choice-row:nth-child(even).highlighted .selection-shape { clip-path:polygon(0 0,100% 65%,2% 100%); }
  .marker { display:none; }
  @keyframes paper-snap { from { opacity:0; transform:translateX(-30px) rotate(7deg) scaleX(.8); } 65% { opacity:1; transform:translateX(3px) rotate(-3deg); } to { transform:rotate(-2deg); } }
  @keyframes type-snap { from { transform:translateX(-9px) skewX(-12deg); } 65% { transform:translateX(8px) skewX(-3deg); } to { transform:translateX(5px) skewX(-6deg); } }
  @media(prefers-reduced-motion:reduce) { .highlighted .selection-backing,.highlighted .word,.expressive .highlighted .word { animation:none; } }
  .poster { gap:0; }
  .poster .choice { min-height:44px; padding:0 12px; }
  .poster .word { line-height:.86; letter-spacing:-.055em; }
  .poster .choice-row { z-index:1; margin-top:-2px; }
  .poster .choice-row:nth-child(1) { transform:translateX(-8%) rotate(-13deg); }
  .poster .choice-row:nth-child(2) { transform:translateX(-2%) rotate(-8deg); }
  .poster .choice-row:nth-child(3) { transform:translateX(3%) rotate(-11deg); }
  .poster .choice-row:nth-child(4) { transform:translateX(-3%) rotate(7deg); }
  .poster .choice-row:nth-child(5) { transform:translateX(1%) rotate(-5deg); }
  .poster .choice-row:nth-child(6) { transform:translateX(4%) rotate(9deg); }
  .poster .choice-row.highlighted { z-index:5; }
  .poster .word::before { display:none; }
  .poster .choice-row:nth-child(3n+1) .word { color:var(--scene-cyan); }
  .poster .choice-row:nth-child(3n+2) .word { color:var(--menu-b,#64dfff); }
  .poster .choice-row:nth-child(3n) .word { color:var(--menu-a,#affaff); }
  .poster .choice-row.highlighted .word { color:#061534; }
  .poster .highlighted .selection-backing { inset:-6px -18px -3px -12px; clip-path:polygon(0 25%,100% 0,93% 100%,2% 90%); }
  .poster .choice-row.highlighted .selection-shape { inset:28% -30px 8% -26px; clip-path:polygon(0 98%,100% 0,91% 84%); background:#fa173b; }
  .poster .choice-row.highlighted .selection-shape::after { display:none; }
  @media(max-width:700px) { .poster .choice-row:nth-child(n) { translate:0; } .poster .choice { padding:3px 8px; } }
  .expressive .word { animation:letter-life 5.6s ease-in-out infinite alternate; animation-delay:calc(var(--order) * -.73s); }
  .expressive .choice-row.highlighted .word { animation:type-snap 220ms cubic-bezier(.2,.9,.25,1.2); }
  .highlighted .selection-backing { animation:paper-snap 200ms cubic-bezier(.2,.9,.25,1.2),paper-life 3.8s ease-in-out 200ms infinite alternate; }
  @keyframes letter-life { from { translate:0 -.7px; rotate:-.18deg; } to { translate:0 .7px; rotate:.18deg; } }
  @keyframes paper-life { from { transform:translate(-.8px,-.4px) rotate(-2.3deg); } to { transform:translate(.8px,.4px) rotate(-1.7deg); } }
  @media(prefers-reduced-motion:reduce) { .expressive .word,.expressive .choice-row.highlighted .word,.highlighted .selection-backing { animation:none; } }
  .poster .word { animation:none; }
  .poster .choice-row.highlighted .word { animation:persona-focus 200ms cubic-bezier(.18,.9,.25,1.15) forwards; transform-origin:center; }
  .poster .choice-row.highlighted .selection-backing { scale:1.1 1.06; }
  .poster .choice-row.highlighted .selection-shape { scale:1.1 1.06; }
  @keyframes persona-focus { from { transform:translateX(0) skewX(-5deg) scale(1); } 70% { transform:translateX(3px) skewX(-6deg) scale(1.28); } to { transform:translateX(3px) skewX(-6deg) scale(1.24); } }
  @media(max-width:700px) { .poster .choice-row.highlighted .word { animation-name:persona-focus-small; } }
  @keyframes persona-focus-small { from { transform:skewX(-5deg) scale(1); } to { transform:skewX(-6deg) scale(1.13); } }
  @media(prefers-reduced-motion:reduce) { .poster .choice-row.highlighted .word { animation:none; transform:skewX(-6deg) scale(1.04); } }
  .expressive .word::before { display:none; }
  .expressive:not(.poster) { gap:28px; }
  .expressive:not(.poster) .choice-row:nth-child(n) { transform:rotate(-2deg); }
  .expressive:not(.poster) .choice-row:nth-child(even) { transform:rotate(2deg) translateX(10px); }
  .expressive:not(.poster) .word { line-height:1.08; letter-spacing:-.015em; overflow-wrap:normal; }
  .expressive:not(.poster) .choice { padding:12px 14px; }
  /* A white inset sits inside the red silhouette, with split-ink selected type. */
  .expressive .choice-row.highlighted .selection-backing { background:#f51b42; inset:-7px -23px -8px -18px; clip-path:polygon(0 24%,100% 0,93% 100%,3% 88%); }
  .expressive .choice-row.highlighted .selection-shape { background:#fff; inset:0 -8px -1px -5px; clip-path:polygon(0 28%,100% 2%,91% 92%,4% 86%); scale:1; }
  .expressive .choice-row.highlighted .selection-shape::after { display:none; }
  .expressive .choice-row:nth-child(even).highlighted .selection-backing { clip-path:polygon(0 0,100% 18%,94% 100%,3% 82%); }
  .expressive .choice-row:nth-child(even).highlighted .selection-shape { clip-path:polygon(2% 9%,98% 23%,91% 91%,5% 77%); }
  .expressive .choice-row.highlighted .word { color:transparent; background:linear-gradient(172deg,#020e37 0 49%,#ed133c 50% 100%); background-clip:text; -webkit-background-clip:text; }
  .poster .choice-row.highlighted .selection-backing { scale:1.08 1.04; }
  .expressive .choice-row.highlighted .selection-backing { inset:-10px -13% -9px -10%; }
  .expressive .choice-row.highlighted .selection-shape { inset:-2px -8% -3px -6%; clip-path:polygon(0 18%,100% 0,98% 98%,1% 100%); }
  .expressive .choice-row:nth-child(even).highlighted .selection-shape { clip-path:polygon(0 0,100% 12%,98% 100%,2% 88%); }
  .expressive .choice-row:nth-child(n).highlighted .selection-backing { inset:-18px -17% -10px -16%; clip-path:polygon(0 100%,100% 0,93% 100%); scale:1.1 1.08; }
  .expressive .choice-row:nth-child(n).highlighted .selection-shape { inset:-12px -17% -6px -10%; clip-path:polygon(0 100%,100% 0,92% 94%); scale:1; }
  .expressive:not(.poster) .choice-row.highlighted .word { scale:1.12; transform-origin:left center; }
  .expressive .choice-row.highlighted .word { -webkit-text-stroke:.4px #ffffff66; }
  @media(prefers-reduced-motion:reduce) { .poster .choice-row.highlighted .word { transform:skewX(-6deg) scale(1.13); } }
</style>

