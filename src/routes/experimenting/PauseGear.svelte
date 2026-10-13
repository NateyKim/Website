<script lang="ts">
  export let rotation = 0;
  const teeth = Array.from({length:64},(_,i)=>{const a=i*Math.PI/32,r=i%4===1||i%4===2?302:263;return `${Math.cos(a)*r},${Math.sin(a)*r}`;}).join(' ');
</script>
<div class="pause-gear" data-angle={rotation} aria-hidden="true">
  <svg viewBox="-340 -340 680 680" fill="none">
    <g class="indexing-gear" style:transform={'rotate('+rotation+'deg)'}>
      <polygon points={teeth} fill="currentColor"/>
      <circle r="191" fill="var(--scene-blue)"/>
      {#each [0,120,240] as angle}<path transform={'rotate('+angle+')'} d="M-22-205L-42-85H42L22-205Z" fill="currentColor"/>{/each}
      <circle r="76" fill="currentColor"/><circle r="40" fill="var(--scene-blue)"/>
      <path d="M0-302V-274" stroke="var(--scene-cyan)" stroke-width="12"/>
    </g>
    <path d="M-303-118A325 325 0 0 1 303-118M303 118A325 325 0 0 1-303 118" stroke="currentColor" stroke-width="2"/>
  </svg>
</div>
<style>
  .pause-gear { width:100%; height:100%; color:var(--scene-ink); }
  svg { display:block; width:100%; height:100%; overflow:visible; }
  .indexing-gear { transform-origin:0 0; transition:transform 250ms cubic-bezier(.17,.86,.23,1); }
  @media(prefers-reduced-motion:reduce) { .indexing-gear { transition:none; } }
</style>
