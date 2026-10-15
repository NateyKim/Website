<script lang="ts">
  export let rotation = 0;
  export let hardware = true;
  const teeth = Array.from({length:64},(_,i)=>{const a=i*Math.PI/32,r=i%4===1||i%4===2?302:263;return `${Math.cos(a)*r},${Math.sin(a)*r}`;}).join(' ');
</script>
<div class="pause-gear" data-angle={rotation} aria-hidden="true">
  <svg viewBox="-340 -340 680 680" fill="none">
    <g class="record-spin"><g class="indexing-gear" style:transform={'rotate('+rotation+'deg)'}>
      <polygon class="gear-body" points={teeth} fill="var(--gear-body,var(--scene-cyan))"/>
      <circle class="vinyl" r="236" fill="var(--gear-vinyl,var(--scene-ink))"/>
      {#each Array(13) as _,i}<circle r={95+i*10} stroke="var(--scene-cyan)" stroke-width="1" opacity=".4"/>{/each}

      <circle r="76" fill="var(--gear-label,var(--scene-cyan))"/><circle r="40" fill="var(--gear-body,var(--scene-blue))"/>
      <path d="M0-302V-274" stroke="var(--scene-cyan)" stroke-width="12"/>
    </g></g>
    {#if hardware}<g class="horn"><path d="M-155-180Q-180-255-105-282" stroke="var(--scene-ink)" stroke-width="22"/><path d="M-155-180Q-180-255-105-282" stroke="var(--scene-cyan)" stroke-width="12"/><path d="M-110-294L-80-330L-12-264L-103-267Z" fill="var(--scene-paper)" stroke="var(--scene-ink)" stroke-width="5"/><path d="M-80-330L-12-264L-24-309Z" fill="var(--scene-ink)"/></g>
    <g class="tonearm"><circle cx="260" cy="-260" r="25" fill="var(--scene-ink)" stroke="var(--scene-paper)" stroke-width="6"/><path d="M260-260L190-105L130-70" stroke="var(--scene-ink)" stroke-width="24"/><path d="M260-260L190-105L130-70" stroke="var(--scene-paper)" stroke-width="12"/><path d="M114-84L146-65L129-34L99-54Z" fill="var(--scene-paper)" stroke="var(--scene-ink)" stroke-width="4"/></g>
    {/if}
    <path d="M-303-118A325 325 0 0 1 303-118M303 118A325 325 0 0 1-303 118" stroke="currentColor" stroke-width="2"/>
  </svg>
</div>
<style>
  .pause-gear { width:100%; height:100%; color:var(--scene-ink); }
  svg { display:block; width:100%; height:100%; overflow:visible; }
  .indexing-gear { transform-origin:0 0; transition:transform 250ms cubic-bezier(.17,.86,.23,1); }
  .record-spin { transform-origin:0 0; animation:record-spin 100s linear infinite; }
  @keyframes record-spin { to { transform:rotate(360deg); } }
  @media(prefers-reduced-motion:reduce) { .indexing-gear { transition:none; } .record-spin { animation:none; } }
  .tonearm { transform-origin:260px -260px; animation:stylus-life 9s ease-in-out infinite alternate; }
  @keyframes stylus-life { from { transform:rotate(-.35deg); } to { transform:rotate(.35deg); } }
  @media(prefers-reduced-motion:reduce) { .tonearm { animation:none; } }
</style>
