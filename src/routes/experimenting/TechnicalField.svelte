<script lang="ts">export let selection = -1;</script>
<div class="signal-poster" aria-hidden="true" style:--shift={Math.max(selection,0)*12+'px'}>
  <svg viewBox="0 0 500 600" fill="none">
    <path class="shadow" d="M-90 422L106 342L153 367L222 117L244 485L285 270L321 357L566 160"/>
    <path class="signal" d="M-90 402L106 322L153 347L222 97L244 465L285 250L321 337L566 140"/>
    <path class="echo" d="M-90 450L106 370L153 395L222 145L244 513L285 298L321 385L566 188"/>
    <path stroke="#d0ffff" stroke-width="2" opacity=".5" d="M45 120L410 15M-50 555L435 407"/>
  </svg>
  <span class="human">HUMAN</span><span class="machine">MACHINE</span>
</div>
<style>
  .signal-poster { position:relative; width:100%; height:100%; transform:rotate(-9deg); }
  svg { width:100%; height:100%; overflow:visible; transform:translateY(var(--shift)); transition:transform 180ms cubic-bezier(.2,.8,.2,1); }
  .signal { stroke:#e8feff; stroke-width:26; stroke-linejoin:miter; }
  .shadow { stroke:#00328d; stroke-width:38; }
  .echo { stroke:#76faff; stroke-width:3; }
  span { position:absolute; font:italic 900 clamp(48px,8vw,110px)/.9 var(--font-display); letter-spacing:-.035em; color:#002877; }
  .human { top:0; left:8%; } .machine { bottom:0; left:12%; color:#a5faff; }
  @media(prefers-reduced-motion:reduce) { svg { transition:none; } }
</style>

