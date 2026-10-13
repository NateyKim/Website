<figure class="work-visual">
  <svg class="movement-study" viewBox="0 0 900 600" fill="none" aria-hidden="true">
    <path class="motion-arc" d="M388 431A143 143 0 0 1 596 256"/>
    <path class="motion-arc inner" d="M408 419A118 118 0 0 1 580 275"/>
    <path class="callout" d="M482 265L391 170H302M554 395H670L705 361H779"/>
    <circle class="joint-marker" cx="494" cy="363" r="66"/>
    <circle class="signal-point" cx="302" cy="170" r="5"/><circle class="signal-point" cx="779" cy="361" r="5"/>
    <path class="bio-trace" d="M155 441H198L207 427L216 460L225 414L234 472L246 431L257 451L270 441H370"/>
  </svg>
  <img src="/project-media/exoskeleton/exo.png" width="1920" height="1080" alt="Human arm wearing Natey Kim's EMG-controlled upper-limb exoskeleton" fetchpriority="high" />
  <figcaption>EMG-controlled exoskeleton</figcaption>
</figure>

<style>
  .work-visual { position:absolute; z-index:2; inset:0; margin:0; pointer-events:none; }
  img { position:absolute; width:100%; height:100%; object-fit:contain; object-position:center; filter:contrast(1.14) saturate(1.05) drop-shadow(3px 6px 0 #00154faa); transition:filter 180ms ease-out; }
  .movement-study { position:absolute; inset:0; width:100%; height:100%; z-index:3; opacity:.8; }
  .motion-arc { stroke:#c7fbff; stroke-width:2; }
  .inner { stroke-width:1; opacity:.5; }
  .callout { stroke:#42eeff; stroke-width:1.2; opacity:.55; }
  .joint-marker { stroke:#f3fdff; stroke-width:1; stroke-dasharray:4 8; opacity:.3; }
  .signal-point { fill:#f3fdff; }
  .bio-trace { stroke:#42eeff; stroke-width:1.5; opacity:.6; }
  figcaption { position:absolute; bottom:4%; left:12%; color:#c9ecff; font:600 13px var(--font-ui); letter-spacing:.04em; }
  @media(max-width:700px) { .movement-study { opacity:.5; } figcaption { display:none; } }
</style>
