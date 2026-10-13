<script lang="ts">
  export let selection = -1;
</script>
<svg viewBox="0 0 500 500" fill="none" aria-hidden="true" class="technical-field">
  <g stroke="currentColor" stroke-width="1" opacity=".28">
    <path d="M40 40H460V460H40Z M40 250H460 M250 40V460"/>
    {#each Array(9) as _,i}<path d={'M'+(50+i*50)+' 35v10 M'+(50+i*50)+' 455v10 M35 '+(50+i*50)+'h10 M455 '+(50+i*50)+'h10'}/>{/each}
    <circle cx="250" cy="250" r="156"/><circle cx="250" cy="250" r="110" stroke-dasharray="3 8"/>
    <path d="M95 250L172 185L250 250L331 312L405 250 M172 185V125H330V312"/>
  </g>
  <g stroke="currentColor" stroke-width="2">
    <path d="M172 185L250 250L331 312"/>
    <circle cx="172" cy="185" r="8"/><circle cx="250" cy="250" r="8"/><circle cx="331" cy="312" r="8"/>
    <path d="M62 378h30l8-12 8 24 8-48 8 68 8-32h60"/>
  </g>
  <g class="cursor" style:transform={'translateY('+(Math.max(selection,0)*36)+'px)'} stroke="currentColor"><path d="M420 160h26 M433 147v26"/></g>
  <g fill="currentColor" font-family="monospace" font-size="10" letter-spacing="2"><text x="40" y="24">HUMAN / MACHINE</text><text x="40" y="487">SIGNAL → MOTION</text></g>
</svg>
<style>
  .technical-field { width:100%; height:100%; color:var(--scene-cyan); }
  .cursor { transition:transform 180ms ease-out; }
  @media(prefers-reduced-motion:reduce) { .cursor { transition:none; } }
</style>
