<script lang="ts">
  export let rotation = 0;
  function points() {
    return Array.from({length:96},(_,i)=>{
      const a=i*Math.PI/48,r=i%4===1||i%4===2?306:273;
      return Math.cos(a)*r+','+Math.sin(a)*r;
    }).join(' ');
  }
</script>

<div class="pause-gear" data-angle={rotation} aria-hidden="true">
  <svg viewBox="-360 -360 720 720">
    <defs><linearGradient id="gear-bevel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f3fdff"/><stop offset=".42" stop-color="#f3fdff"/><stop offset=".44" stop-color="#42eeff"/><stop offset=".76" stop-color="#0099ff"/><stop offset="1" stop-color="#f3fdff"/></linearGradient><mask id="pause-gear-hole"><rect x="-360" y="-360" width="720" height="720" fill="white"/><circle r="180" fill="black"/></mask></defs>
    <g class="indexing-gear" style:transform={'rotate('+rotation+'deg)'}>
      <polygon class="gear-extrusion" points={points()} transform="translate(10 12)" mask="url(#pause-gear-hole)"/>
      <polygon class="gear-body" points={points()} mask="url(#pause-gear-hole)"/>
      <circle class="outer-rim" r="253"/><circle class="inner-rim" r="191"/>
      {#each [0,60,120,180,240,300] as angle}<g transform={'rotate('+angle+')'}><path class="insert" d="M211-15L239-15L247 0L239 15L211 15Z"/><path class="insert-line" d="M218 0H238"/></g>{/each}
      <path class="alignment" d="M0-306V-282M282 0H306M0 282V306M-306 0H-282"/>
    </g>
    <circle class="hub" r="108"/>
    <path class="neural-paths" d="M-60 23L-34 7L-12 11L8-9L31-5L62-23M8-9L6-36L-6-52M-34 7L-45-22L-64-31M31-5L41 27L58 39M-12 11L-7 44L8 56"/>
    <g class="synapses"><circle cx="-60" cy="23" r="5"/><circle cx="62" cy="-23" r="5"/><circle cx="-6" cy="-52" r="5"/><circle cx="-64" cy="-31" r="5"/><circle cx="58" cy="39" r="5"/><circle cx="8" cy="56" r="5"/></g>
    <circle class="core" cx="8" cy="-9" r="12"/>
    <path class="outer-track" d="M-256-210A331 331 0 0 1 302 134M263 201A331 331 0 0 1-324-70"/>
  </svg>
</div>

<style>
  .pause-gear { width:100%; height:100%; }
  svg { display:block; width:100%; height:100%; overflow:visible; }
  .indexing-gear { transform-origin:0 0; transition:transform 250ms cubic-bezier(.17,.86,.23,1); }
  .gear-body { fill:url(#gear-bevel); stroke:#00154f; stroke-width:2; }
  .gear-extrusion { fill:#00154f; }
  .outer-rim { fill:none; stroke:#0099ff; stroke-width:3; }
  .inner-rim { fill:none; stroke:#00154f; stroke-width:3; }
  .insert { fill:#00154f; }
  .insert-line { stroke:#42eeff; stroke-width:2; }
  .alignment { stroke:#0099ff; stroke-width:4; }
  .hub { fill:#00154f; stroke:#42eeff; stroke-width:2; }
  .neural-paths { stroke:#42eeff; stroke-width:3; fill:none; }
  .synapses { fill:#f3fdff; }
  .core { fill:#42eeff; }
  .outer-track { fill:none; stroke:#7bddff; stroke-width:1; opacity:.7; }
  @media(prefers-reduced-motion:reduce){ .indexing-gear { transition:none; } }
</style>
