<script lang="ts">
  export let rotation = 0;
  function points() {
    return Array.from({ length: 96 }, (_, i) => {
      const angle = i * Math.PI * 2 / 96;
      const r = i % 4 === 1 || i % 4 === 2 ? 305 : 270;
      return Math.cos(angle) * r + ',' + Math.sin(angle) * r;
    }).join(' ');
  }
</script>

<div class="pause-gear" data-angle={rotation} aria-hidden="true">
  <svg viewBox="-360 -360 720 720">
    <g class="indexing-gear" style:transform={'rotate(' + rotation + 'deg)'}>
      <polygon class="gear-body" points={points()} />
      <circle class="gear-rim" r="235" />
      <circle class="gear-cutout" r="182" />
      {#each [0,60,120,180,240,300] as angle}
        <g transform={'rotate(' + angle + ')'}><circle class="bolt" cx="212" cy="0" r="13"/><path class="bolt-slot" d="M206 0H218"/></g>
      {/each}
      <path class="alignment" d="M0-300V-263M263 0H300M0 263V300M-300 0H-263" />
    </g>
    <circle class="hub" r="100" />
    <circle class="hub-ring" r="73" />
    <path class="hub-traces" d="M-50-25H-5L13-7H47M-45 2H-18L0 20H46M-27 45V28L-41 14M0-48V-28L20-9M42 32H16L0 47"/>
    <g class="hub-nodes"><circle cx="-50" cy="-25" r="5"/><circle cx="47" cy="-7" r="5"/><circle cx="46" cy="20" r="5"/></g>
    <circle class="outer-track" r="336" />
  </svg>
</div>

<style>
  .pause-gear { width: 100%; height: 100%; }
  svg { display: block; width: 100%; height: 100%; overflow: visible; filter: drop-shadow(13px 16px 0 #031a49); }
  .indexing-gear { transition: transform 230ms cubic-bezier(.16,.85,.25,1); transform-origin: 0 0; }
  .gear-body { fill: #edfaff; stroke: #061735; stroke-width: 9; }
  .gear-rim { fill: none; stroke: #0754fa; stroke-width: 3; }
  .gear-cutout { fill: #0754fa; stroke: #061735; stroke-width: 10; }
  .bolt { fill: #061735; }
  .bolt-slot { stroke: #53eeff; stroke-width: 3; }
  .alignment { stroke: #0754fa; stroke-width: 8; }
  .hub { fill: #061735; stroke: #53eeff; stroke-width: 4; }
  .hub-ring { fill: none; stroke: #53eeff; stroke-width: 1; stroke-dasharray: 6 7; }
  .hub-traces { fill: none; stroke: #53eeff; stroke-width: 3; }
  .hub-nodes { fill: #edfaff; }
  .outer-track { fill: none; stroke: #53eeff; stroke-width: 1; stroke-dasharray: 16 12; opacity: .5; }
  @media (prefers-reduced-motion: reduce) { .indexing-gear { transition: none; } }
</style>
