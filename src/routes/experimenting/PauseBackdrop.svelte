<script lang="ts">
  import { onMount } from 'svelte';
  import WaterField from './WaterField.svelte';
  export let rotation = 0;
  let scene: HTMLDivElement;
  onMount(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = scene.closest<HTMLElement>(".experiment");
    let reduced = preference.matches, targetX = 0, targetY = 0, x = 0, y = 0, frame = 0;
    function move(event: PointerEvent) {
      if (reduced || event.pointerType === 'touch') return;
      targetX = (event.clientX / window.innerWidth - .5) * 28;
      targetY = (event.clientY / window.innerHeight - .5) * 20;
    }
    function preferenceChange() { reduced = preference.matches; if (reduced) { targetX = 0; targetY = 0; } }
    function animate() {
      const nextX = reduced ? 0 : x + (targetX - x) * .075;
      const nextY = reduced ? 0 : y + (targetY - y) * .075;
      if (Math.abs(nextX - x) > .002 || Math.abs(nextY - y) > .002) {
        x = nextX; y = nextY;
        scene.style.setProperty('--mx', x.toFixed(2) + 'px');
        scene.style.setProperty('--my', y.toFixed(2) + 'px');
        root?.style.setProperty('--look-x', (x * .25).toFixed(2) + 'deg');
        root?.style.setProperty('--look-y', (-y * .2).toFixed(2) + 'deg');
      }
      frame = requestAnimationFrame(animate);
    }
    window.addEventListener('pointermove', move, {passive:true});
    preference.addEventListener('change', preferenceChange);
    frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove',move); preference.removeEventListener('change',preferenceChange); };
  });
</script>

<div class="pause-backdrop" bind:this={scene} aria-hidden="true" style:--phase={(rotation % 360) / 15 + 'px'}>
  <div class="field"></div><div class="water-light"></div>
  {#key rotation}{#if rotation !== 0}<div class="selection-wake"></div>{/if}{/key}
  <svg class="signal-field" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
    <g class="surface-ripples"><path d="M-100 51C167 9 292 125 578 65S1113 5 1550 48"/><path d="M-100 98C183 42 322 172 628 103S1153 44 1550 85"/></g>
    <g class="ribbons">
      <path class="ribbon-underlay" d="M-180 840C270 740 70 380 395 250S790 344 770 120S1120-80 1460-55"/>
      <path class="ribbon-main" d="M-150 910C302 740 83 451 405 300S751 329 802 117S1132-29 1490-73"/>
      <path class="ribbon-edge" d="M-160 960C332 761 118 494 427 340S797 352 839 136S1180 10 1510-30"/>
      <path class="signal-current" d="M-150 910C302 740 83 451 405 300S751 329 802 117S1132-29 1490-73"/>
    </g>
    <g class="flow-lines">
      <path d="M-160 580C134 660 78 211 342 127S744 183 1110-115"/>
      <path d="M-160 610C158 690 105 242 367 156S770 212 1134-85"/>
      <path d="M-160 640C182 720 132 273 391 185S794 241 1158-55"/>
    </g>
    <g class="signal-tracks">
      <path d="M30 900V754L81 703H147M51 900V766L101 724H162"/>
      <circle cx="147" cy="703" r="5"/><circle cx="162" cy="724" r="5"/>
    </g>
  </svg>
  <WaterField />
  <div class="menu-field"></div>
  <div class="print-grain"></div>
</div>

<style>
  .pause-backdrop { --mx:0px; --my:0px; position:absolute; inset:0; z-index:-1; overflow:hidden; pointer-events:none; background:var(--scene-blue,#1745ff); }
  .field { position:absolute; inset:0; background:radial-gradient(ellipse at 25% 0%, #e0ffff66 0%,transparent 45%),linear-gradient(180deg,#65edff 0%,#11b7ec 15%,#1259eb 36%,#06278b 65%,#00082b 100%); }
  .signal-field { position:absolute; inset:-35px; width:calc(100% + 70px); height:calc(100% + 70px); transform:translate(var(--mx),var(--my)); }
  .ribbons { transform:translateX(var(--phase)); transition:transform 250ms cubic-bezier(.2,.8,.2,1); }
  .ribbon-underlay { stroke:#063bb0; stroke-width:110; opacity:.24; }
  .ribbon-main { stroke:#9fffff; stroke-width:60; opacity:.22; }
  .ribbon-edge { stroke:#f3fdff; stroke-width:1.5; opacity:.3; }
  .signal-current { stroke:#f3fdff; stroke-width:15; stroke-dasharray:100 900; stroke-linecap:round;  opacity:.25; }
  .flow-lines { stroke:#b7fcff; stroke-width:1; opacity:.25; }
  .signal-tracks { stroke:#42eeff; stroke-width:1.5; opacity:.45; }
  .menu-field { position:absolute; inset:0; background:linear-gradient(90deg,transparent 45%,#00154f18 75%,#00154f22); }
  .print-grain { position:absolute; right:-5%; bottom:-10%; width:55%; height:60%; opacity:.04; background:radial-gradient(#0099ff 1px,transparent 1.5px) 0 0/7px 7px; mask-image:linear-gradient(0deg,black,transparent); }
  @keyframes signal-flow { to { stroke-dashoffset:-1000; } }
  @media(max-width:700px) {
    .menu-field { background:linear-gradient(180deg,transparent,#00154f33); opacity:1; }
    .ribbon-main { stroke-width:100; opacity:.15; }
    .signal-field { opacity:.75; }
  }
  @media(prefers-reduced-motion:reduce) { .signal-current { animation:none; } .ribbons { transition:none; } }
  .surface-ripples { stroke:#eaffff; stroke-width:1.2; opacity:.23; }
  .water-light { position:absolute; inset:-15% -10% 25%; background:repeating-linear-gradient(111deg,transparent 0 160px,#efffff14 194px,transparent 255px); mask-image:linear-gradient(180deg,black,transparent 95%); transform:translate(var(--mx),var(--my)); }
  .selection-wake { position:absolute; left:-5%; top:13%; width:67%; height:85%; opacity:0; pointer-events:none; background:linear-gradient(115deg,transparent 20%,#c5ffff55 40%,transparent 60%); clip-path:polygon(0 67%,100% 0,93% 24%,3% 100%); animation:selection-wake 360ms ease-out; }
  @keyframes selection-wake { from { opacity:.45; transform:translateX(-30px); } to { opacity:0; transform:translateX(20px); } }
  @media(prefers-reduced-motion:reduce) { .selection-wake { animation:none; } }
</style>
