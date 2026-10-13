<script lang="ts">
  export let rotation = 0;
</script>
<div class="pause-backdrop" aria-hidden="true">
  <div class="grid"></div>
  <div class="plane"></div>
  {#key rotation}<div class="response"></div>{/key}
</div>
<style>
  .pause-backdrop { position:absolute; inset:0; z-index:-1; overflow:hidden; pointer-events:none; background:linear-gradient(180deg,#184e76 0%,#102e49 44%,#071828 100%); }
  .grid { position:absolute; inset:0; background:linear-gradient(#b8eaff08 1px,transparent 1px),linear-gradient(90deg,#b8eaff08 1px,transparent 1px); background-size:48px 48px; mask-image:linear-gradient(90deg,black,transparent 70%); }
  .plane { position:absolute; inset:0; background:#02111f40; clip-path:polygon(53% 0,100% 0,100% 100%,48% 100%); border:0; }
  .response { position:absolute; top:0; left:0; width:48%; height:1px; background:#73e1e8; opacity:0; animation:response 300ms ease-out; }
  @keyframes response { from { opacity:.7; } to { opacity:0; } }
  @media(prefers-reduced-motion:reduce) { .response { animation:none; } }
</style>
