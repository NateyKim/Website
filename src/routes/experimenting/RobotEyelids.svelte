<script lang="ts">
  export let phase: 'closing' | 'opening' = 'closing';
</script>
<div class="robot-eyelids" class:opening={phase === 'opening'} data-phase={phase} aria-hidden="true">
  {#each ['upper','lower'] as side}
    <div class={'lid '+side}><div class="plate">
      <div class="recess"></div><div class="seam"></div>
      <div class="bracket left"></div><div class="bracket right"></div>
      <div class="actuator"></div>
    </div></div>
  {/each}
</div>
<style>
  .robot-eyelids { position:fixed; inset:0; z-index:100; overflow:hidden; cursor:wait; touch-action:none; }
  .lid { position:absolute; left:0; width:100%; height:58%; will-change:transform; }
  .upper { top:0; animation:close-upper 260ms cubic-bezier(.6,0,.4,1) both; }
  .lower { bottom:0; animation:close-lower 260ms cubic-bezier(.6,0,.4,1) both; }
  .plate { position:absolute; inset:0; background:var(--scene-ink,#001347); clip-path:polygon(0 0,100% 0,100% 94%,78% 94%,75% 100%,52% 100%,49% 96%,26% 96%,23% 100%,0 100%); }
  .lower .plate { transform:rotate(180deg); }
  .recess { position:absolute; inset:7% 4% 16%; background:linear-gradient(110deg,transparent 44%,#ffffff09 44% 45%,transparent 45%),var(--scene-blue,#0754fa); opacity:.35; clip-path:polygon(0 0,100% 0,100% 77%,92% 100%,5% 100%,0 85%); }
  .seam { position:absolute; left:0; right:0; height:3px; bottom:15%; background:var(--scene-cyan,#8cf3ff); box-shadow:0 5px 0 #0008; }
  .bracket { position:absolute; bottom:22%; width:14%; height:24px; border-top:3px solid var(--scene-cyan); border-bottom:8px solid var(--scene-blue); transform:skewX(-25deg); }
  .left { left:5%; } .right { right:5%; }
  .actuator { position:absolute; left:47%; bottom:19%; width:6%; height:20%; background:repeating-linear-gradient(90deg,var(--scene-cyan) 0 2px,transparent 2px 9px); opacity:.5; clip-path:polygon(20% 0,80% 0,100% 100%,0 100%); }
  .opening .upper { animation:open-upper 320ms cubic-bezier(.16,.8,.25,1) both; }
  .opening .lower { animation:open-lower 320ms cubic-bezier(.16,.8,.25,1) both; }
  @keyframes close-upper { from { transform:translateY(-105%); } to { transform:translateY(0); } }
  @keyframes close-lower { from { transform:translateY(105%); } to { transform:translateY(0); } }
  @keyframes open-upper { from { transform:translateY(0); } to { transform:translateY(-105%); } }
  @keyframes open-lower { from { transform:translateY(0); } to { transform:translateY(105%); } }
  @media(prefers-reduced-motion:reduce) { .robot-eyelids { display:none; } .lid,.opening .lid { animation:none; } }
</style>
