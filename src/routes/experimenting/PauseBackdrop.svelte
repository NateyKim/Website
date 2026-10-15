<script lang="ts">export let rotation = 0;</script>
<div class="pause-backdrop" aria-hidden="true">
  <div class="light"></div><div class="depth"></div><div class="cut"></div><div class="edge"></div>
  <div class="halftone"></div>
  {#key rotation}{#if rotation}<div class="response"></div>{/if}{/key}
</div>
<style>
  .pause-backdrop { position:absolute; inset:0; z-index:-1; overflow:hidden; pointer-events:none; background:linear-gradient(170deg,var(--scene-cyan) 0%,var(--scene-blue) 38%,var(--scene-ink) 100%); }
  .light { position:absolute; inset:-20%; background:linear-gradient(116deg,transparent 26%,#efffff30 27%,#c6ffff10 35%,transparent 36%); animation:drift 16s ease-in-out infinite alternate; }
  .depth { position:absolute; inset:0; background:var(--scene-ink); clip-path:polygon(61% 0,100% 0,100% 100%,47% 100%); }
  .cut { position:absolute; inset:0; background:var(--scene-blue); clip-path:polygon(59% 0,62% 0,48% 100%,43% 100%); }
  .edge { position:absolute; inset:0; background:var(--scene-cyan); clip-path:polygon(59.6% 0,60% 0,46% 100%,45.6% 100%); opacity:.45; }
  .halftone { position:absolute; inset:40% 40% -10% -10%; background:radial-gradient(#001347 1.2px,transparent 1.5px) 0 0/7px 7px; opacity:.24; transform:rotate(-12deg); mask-image:linear-gradient(0deg,black,transparent); }
  .response { position:absolute; inset:0; background:#d9ffff; clip-path:polygon(0 70%,58% 22%,49% 44%,0 86%); animation:response 240ms ease-out forwards; }
  @keyframes response { from { opacity:.24; translate:-25px 0; } to { opacity:0; translate:15px 0; } }
  @keyframes drift { to { transform:translate(3%,2%); } }
  @media(max-width:700px) { .depth { clip-path:polygon(100% 0,100% 100%,0 100%,0 30%); opacity:.58; } .cut,.edge { display:none; } }
  @media(prefers-reduced-motion:reduce) { .light,.response { animation:none; } .response { display:none; } }
</style>
