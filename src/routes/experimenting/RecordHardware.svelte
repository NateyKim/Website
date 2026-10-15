<svg viewBox="-120 -210 360 300" fill="none" class="record-hardware-art" aria-hidden="true">
  <g class="tonearm">
    <circle cx="160" cy="-160" r="17" fill="var(--scene-ink)" stroke="var(--scene-paper)" stroke-width="4"/>
    <circle cx="160" cy="-160" r="7" fill="var(--gear-body,var(--scene-cyan))"/>
    <path d="M160-160L112-40L56-10" stroke="var(--scene-ink)" stroke-width="17" stroke-linejoin="bevel"/>
    <path d="M160-160L112-40L56-10" stroke="var(--scene-paper)" stroke-width="8" stroke-linejoin="bevel"/>
    <path d="M48-22L70-8L58 12L36-2Z" fill="var(--scene-paper)" stroke="var(--scene-ink)" stroke-width="3"/>
  </g>
  <g class="horn">
    <path d="M-70-65Q-92-116-38-137" stroke="var(--scene-ink)" stroke-width="15"/>
    <path d="M-70-65Q-92-116-38-137" stroke="var(--scene-cyan)" stroke-width="8"/>
    <path d="M-45-149L-19-174L24-132L-39-130Z" fill="var(--scene-paper)" stroke="var(--scene-ink)" stroke-width="3"/>
    <ellipse cx="3" cy="-154" rx="12" ry="29" transform="rotate(-43 3 -154)" fill="var(--scene-ink)" stroke="var(--scene-paper)" stroke-width="3"/>
  </g>
</svg>
<style>
  .record-hardware-art { display:block; width:100%; height:100%; overflow:visible; }
  .tonearm { transform-origin:160px -160px; animation:stylus 9s ease-in-out infinite alternate; }
  @keyframes stylus { to { transform:rotate(.5deg); } }
  @media(prefers-reduced-motion:reduce) { .tonearm { animation:none; } }
</style>
