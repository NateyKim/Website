<script lang="ts">
  import { onMount } from 'svelte';
  let scene: HTMLDivElement;
  const patches = Array.from({length:34},(_,i)=>{
    const x=(i*137)%1400,y=(i*53)%240,w=65+(i*31)%150;
    return `${x},${y} ${x+w*.3},${y-9} ${x+w*.75},${y+2} ${x+w},${y+12} ${x+w*.65},${y+26} ${x+w*.2},${y+18}`;
  });
  onMount(()=>{
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    function move(e:PointerEvent) {
      if(motion.matches || e.pointerType==='touch') return;
      scene.style.setProperty('--dx',(e.clientX/innerWidth-.5)*18+'px');
      scene.style.setProperty('--dy',(e.clientY/innerHeight-.5)*12+'px');
    }
    window.addEventListener('pointermove',move,{passive:true});
    return()=>window.removeEventListener('pointermove',move);
  });
</script>
<div class="depth-scene" bind:this={scene} aria-hidden="true">
  <div class="architecture"></div><div class="blue-depth"></div>
  <svg class="surface" viewBox="0 0 1400 350" preserveAspectRatio="none"><g>{#each patches as points,i}<polygon {points} opacity={.15+(i%4)*.09}/>{/each}</g></svg>
  <div class="shafts"></div>
  <svg class="fragments" viewBox="0 0 1400 900" preserveAspectRatio="none"><path d="M136 88L181 62L160 130Z M326 362L342 316L370 350Z M1010 120L1058 140L1027 174Z M1223 673L1248 645L1274 708Z" fill="#ffdbba"/><path d="M185 652L216 621L229 650Z M560 72L581 45L594 91Z M1132 421L1160 398L1166 440Z" fill="#ff865d"/></svg>
</div>
<style>
  .depth-scene { --dx:0px; --dy:0px; position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
  .architecture { position:absolute; inset:-4%; background:url('/photosilike/coloseeum.jpg') center 75%/cover; filter:contrast(1.06) saturate(1.12); opacity:1; transform:translate(var(--dx),var(--dy)) scale(1.03); transition:transform 650ms ease-out; }
  .blue-depth { position:absolute; inset:0; background:linear-gradient(180deg,#26396620 0%,#14326b45 32%,#071b5599 68%,#030c36ee 100%); }
  .surface { position:absolute; inset:-3% -8% auto; width:116%; height:35%; fill:#ffdabd; filter:blur(1.4px); mix-blend-mode:screen; opacity:.22; transform:perspective(500px) rotateX(24deg); mask-image:linear-gradient(180deg,#000,transparent); }
  .surface g { animation:refraction 13s ease-in-out infinite alternate; }
  .shafts { position:absolute; inset:-20%; background:linear-gradient(115deg,transparent 30%,#ffe6c820 34%,transparent 37%,transparent 52%,#ffe6c812 54%,transparent 60%); mix-blend-mode:screen; animation:illumination 16s ease-in-out infinite alternate; }
  .fragments { position:absolute; inset:0; width:100%; height:100%; opacity:.34; transform:translate(calc(var(--dx) * -1.4),calc(var(--dy) * -1.4)); transition:transform 800ms ease-out; animation:fragment-drift 9s ease-in-out infinite alternate; }
  @keyframes refraction { to { transform:translate(45px,12px) scaleY(1.12); opacity:.7; } }
  @keyframes illumination { to { transform:translate(4%,2%); opacity:.5; } }
  @keyframes fragment-drift { to { translate:0 -15px; } }
  @media(prefers-reduced-motion:reduce) { .surface g,.shafts,.fragments { animation:none; } .architecture,.fragments { transform:none; transition:none; } }
</style>
