<script lang="ts">
  import { onMount } from 'svelte';
  export let menuImpulse = 0;
  export let vertical = false;
  export let divider = false;
  let path = '';
  let strength = 0;
  let reduced = false;
  const samples = Array<number>(300).fill(0);

  function draw() {
    path = samples.map((value, i) => {
      if (vertical) {
        const y = i / (samples.length - 1) * 1000;
        return (i ? 'L' : 'M') + (60 + value * 48).toFixed(2) + ',' + y.toFixed(2);
      }
      return (i ? 'L' : 'M') + (i / (samples.length - 1) * 720).toFixed(2) + ',' + (60 + value * 50).toFixed(2);
    }).join(' ');
  }
  draw();
  onMount(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduced = motion.matches;
    let frame = 0, previous = performance.now(), lastDraw = 0, seen = menuImpulse;
    let lastX = 0, lastY = 0, lastMove = 0, mouseEnergy = 0, menuEnergy = 0;
    function movement(event: PointerEvent) {
      const now = performance.now();
      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
      if (lastMove && distance > 0) mouseEnergy = Math.max(mouseEnergy, Math.min(.32, .12 + distance / Math.max(16, now - lastMove) * .075));
      lastX = event.clientX; lastY = event.clientY; lastMove = now;
    }
    function animate(now: number) {
      const elapsed = Math.min(50, now - previous); previous = now;
      if (seen !== menuImpulse) { menuEnergy = 1; seen = menuImpulse; }
      menuEnergy *= Math.exp(-elapsed / 330);
      mouseEnergy *= Math.exp(-elapsed / 220);
      strength = Math.min(1, .025 + mouseEnergy + menuEnergy);
      if (now - lastDraw >= (reduced ? 160 : 25)) {
        lastDraw = now;
        const carrier = Math.sin(now * .13) * .58 + Math.sin(now * .219) * .29 + Math.sin(now * .071) * .22;
        samples.unshift(carrier * strength * (reduced ? .2 : 1)); samples.pop();
        draw();
      }
      if (!reduced) frame = requestAnimationFrame(animate);
    }
    window.addEventListener('pointermove', movement, { passive: true });
    function changeMotion() {
      reduced = motion.matches;
      cancelAnimationFrame(frame);
      if (reduced) { samples.fill(0); strength = 0; draw(); }
      else { previous = performance.now(); frame = requestAnimationFrame(animate); }
    }
    motion.addEventListener('change', changeMotion);
    if (!reduced) frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); motion.removeEventListener('change', changeMotion); window.removeEventListener('pointermove', movement); };
  });
</script>

<svg class="reactive-signal" class:vertical viewBox={vertical ? '0 0 120 1000' : '0 0 720 120'} preserveAspectRatio="none" aria-hidden="true" data-strength={strength.toFixed(3)}>
  {#if divider}<path class="signal-outline" d={path} />{/if}
  <path class="signal-halo" d={path} style:opacity={.2 + strength * .6} />
  <path class="signal-core" d={path} />
</svg>

<style>
  .reactive-signal { display: block; width: 100%; height: 120px; overflow: visible; pointer-events: none; fill: none; }
  .vertical { height: 100%; }
  .signal-halo { stroke: var(--scene-cyan,#53eeff); stroke-width: 8; filter: blur(2px); }
  .signal-core { stroke: var(--scene-paper,#edffff); stroke-width: 2; }
  .reactive-signal:not(.vertical) .signal-core { stroke: var(--scene-cyan,#53eeff); stroke-width: 1.5; }
  .signal-outline { stroke:#00154f; stroke-width:6; opacity:.55; }
</style>
