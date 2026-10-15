<script lang="ts" context="module">
  let visitPhoto = '';
</script>
<script lang="ts">
  import { onMount } from 'svelte';
  export let onScene: (photo:string, frame:{x:number;y:number;w:number;h:number}) => void = () => {};
  let scene: HTMLDivElement;
  let photo = '';
  let sourceImage: HTMLImageElement | undefined;
  const photos = ['bench.jpg','bluemountain.jpg','Jamaica.jpg','strawsburg.jpg','coloseeum.jpg','IMG_20230730_211429627_HDR.jpg','IMG_20230725_172908282.jpg','kyoto.jpg','philly.jpg','kaiyukan.jpg','poconos.jpg','tokyo-flame.jpg','tokyo-skyline.jpg','wooded-lake.jpg','gateway-arch.jpg'];
  const focal: Record<string,[number,number]> = {
    'bench.jpg':[.45,.52], 'bluemountain.jpg':[.55,.38], 'Jamaica.jpg':[.52,.6], 'strawsburg.jpg':[.48,.48],
    'coloseeum.jpg':[.36,.64], 'IMG_20230730_211429627_HDR.jpg':[.5,.55], 'IMG_20230725_172908282.jpg':[.48,.42],
    'kyoto.jpg':[.3,.48], 'philly.jpg':[.28,.52], 'kaiyukan.jpg':[.5,.54], 'poconos.jpg':[.4,.65],
    'tokyo-flame.jpg':[.5,.61], 'tokyo-skyline.jpg':[.52,.63], 'wooded-lake.jpg':[.58,.61], 'gateway-arch.jpg':[.51,.46]
  };
  function crop() {
    if(!sourceImage) return;
    const {width,height}=scene.getBoundingClientRect();
    const scale=Math.max(width/sourceImage.naturalWidth,height/sourceImage.naturalHeight)*1.35;
    const w=sourceImage.naturalWidth*scale,h=sourceImage.naturalHeight*scale;
    const [fx,fy]=focal[visitPhoto] ?? [.5,.5];
    const left=Math.max(width-w,Math.min(0,width*.32-fx*w));
    const top=Math.max(height-h,Math.min(0,height*.3-fy*h));
    scene.style.setProperty('--photo-size',w+'px '+h+'px');
    scene.style.setProperty('--photo-position',left+'px '+top+'px');
    onScene(photo,{x:left/width*1000,y:top/height*1000,w:w/width*1000,h:h/height*1000});
  }
  function palette(image: HTMLImageElement) {
    const canvas=document.createElement('canvas'); canvas.width=32; canvas.height=32;
    const ctx=canvas.getContext('2d'); if(!ctx) return;
    ctx.drawImage(image,0,0,32,32);
    const pixels=ctx.getImageData(0,0,32,32).data;
    const hues=new Array(36).fill(0);
    for(let i=0;i<pixels.length;i+=4) {
      const r=pixels[i]/255,g=pixels[i+1]/255,b=pixels[i+2]/255;
      const max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;
      if(delta<.12 || max<.18 || min>.85) continue;
      let hue=max===r?((g-b)/delta+6)%6:max===g?(b-r)/delta+2:(r-g)/delta+4;
      hues[Math.floor(hue*6)] += delta*(1-Math.abs((max+min)/2-.5));
    }
    const hue=hues.indexOf(Math.max(...hues))*10+5;
    const root=scene.closest<HTMLElement>('.experiment');
    root?.style.setProperty('--scene-cyan',`hsl(${hue} 75% 80%)`);
    root?.style.setProperty('--scene-blue',`hsl(${hue} 62% 32%)`);
    root?.style.setProperty('--scene-ink',`hsl(${hue} 55% 10%)`);
    root?.style.setProperty('--gear-body',`hsl(${hue} 72% 53%)`);
    root?.style.setProperty('--gear-vinyl',`hsl(${hue} 60% 13%)`);
    root?.style.setProperty('--gear-label',`hsl(${(hue+25)%360} 80% 78%)`);
    root?.style.setProperty('--menu-a',`hsl(${hue} 75% 86%)`);
    root?.style.setProperty('--menu-b',`hsl(${(hue+25)%360} 70% 82%)`);
    root?.style.setProperty('--menu-c',`hsl(${(hue+335)%360} 65% 90%)`);
    scene.style.setProperty('--photo-shadow',`hsl(${hue} 55% 12% / .83)`);
    scene.style.setProperty('--photo-accent',`hsl(${hue} 80% 80%)`);
  }
  const patches = Array.from({length:34},(_,i)=>{
    const x=(i*137)%1400,y=(i*53)%240,w=65+(i*31)%150;
    return `${x},${y} ${x+w*.3},${y-9} ${x+w*.75},${y+2} ${x+w},${y+12} ${x+w*.65},${y+26} ${x+w*.2},${y+18}`;
  });
  onMount(()=>{
    if(!visitPhoto) {
      let previous=''; try { previous=sessionStorage.getItem('pause-photo') ?? ''; } catch {}
      const pool=photos.filter(name=>name!==previous);
      visitPhoto=pool[Math.floor(Math.random()*pool.length)];
      try { sessionStorage.setItem('pause-photo',visitPhoto); } catch {}
    }
    photo='/photosilike/'+visitPhoto;
    const image=new Image(); image.onload=()=>{ sourceImage=image; palette(image); crop(); }; image.src=photo;
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    function move(e:PointerEvent) {
      if(motion.matches || e.pointerType==='touch') return;
      scene.style.setProperty('--dx',(e.clientX/innerWidth-.5)*18+'px');
      scene.style.setProperty('--dy',(e.clientY/innerHeight-.5)*12+'px');
    }
    const resize=new ResizeObserver(crop); resize.observe(scene);
    window.addEventListener('pointermove',move,{passive:true});
    return()=>{ resize.disconnect(); image.onload=null; window.removeEventListener('pointermove',move); };
  });
</script>
<div class="depth-scene" bind:this={scene} aria-hidden="true" data-photo={photo}>
  <div class="architecture" style:background-image={photo ? `url("${photo}")` : 'none'}></div><div class="blue-depth"></div>
  <svg class="surface" viewBox="0 0 1400 350" preserveAspectRatio="none"><g>{#each patches as points,i}<polygon {points} opacity={.15+(i%4)*.09}/>{/each}</g></svg>
  <div class="print-tone"></div><div class="color-mask"></div><div class="shafts"></div>
  <svg class="fragments" viewBox="0 0 1400 900" preserveAspectRatio="none"><path d="M136 88L181 62L160 130Z M326 362L342 316L370 350Z M1010 120L1058 140L1027 174Z M1223 673L1248 645L1274 708Z" fill="#ffdbba"/><path d="M185 652L216 621L229 650Z M560 72L581 45L594 91Z M1132 421L1160 398L1166 440Z" fill="#ff865d"/></svg>
</div>
<style>
  .depth-scene { background:linear-gradient(165deg,var(--scene-blue),var(--scene-ink)); --dx:0px; --dy:0px; position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
  .architecture { position:absolute; inset:-4%; background-position:var(--photo-position,center); background-size:var(--photo-size,cover); background-repeat:no-repeat; filter:contrast(1.06) saturate(1.12); opacity:.28; mask-image:linear-gradient(115deg,transparent 5%,#000 27%,#000 55%,transparent 94%); transform:translate(var(--dx),var(--dy)) scale(1.03); transition:transform 650ms ease-out; }
  .blue-depth { position:absolute; inset:0; background:linear-gradient(180deg,#26396620 0%,#14326b45 32%,#071b5599 68%,var(--photo-shadow,#030c36ee) 100%); }
  .surface { position:absolute; inset:-3% -8% auto; width:116%; height:35%; fill:var(--photo-accent,#ffdabd); filter:blur(1.4px); mix-blend-mode:screen; opacity:.22; transform:perspective(500px) rotateX(24deg); mask-image:linear-gradient(180deg,#000,transparent); }
  .surface g { animation:refraction 13s ease-in-out infinite alternate; }
  .shafts { position:absolute; inset:-20%; background:linear-gradient(115deg,transparent 30%,#ffe6c820 34%,transparent 37%,transparent 52%,#ffe6c812 54%,transparent 60%); mix-blend-mode:screen; animation:illumination 16s ease-in-out infinite alternate; }
  .fragments { position:absolute; inset:0; width:100%; height:100%; opacity:.34; transform:translate(calc(var(--dx) * -1.4),calc(var(--dy) * -1.4)); transition:transform 800ms ease-out; animation:fragment-drift 9s ease-in-out infinite alternate; }
  @keyframes refraction { to { transform:translate(45px,12px) scaleY(1.12); opacity:.7; } }
  @keyframes illumination { to { transform:translate(4%,2%); opacity:.5; } }
  @keyframes fragment-drift { to { translate:0 -15px; } }
  @media(prefers-reduced-motion:reduce) { .surface g,.shafts,.fragments { animation:none; } .architecture,.fragments { transform:none; transition:none; } }
  .color-mask { position:absolute; inset:0; background:linear-gradient(110deg,transparent 12%,var(--scene-blue) 50%,var(--scene-ink) 100%); opacity:.88; clip-path:polygon(var(--divide-top,35%) 0,100% 0,100% 100%,var(--divide-bottom,20%) 100%); }
  .print-tone { position:absolute; inset:0; background:radial-gradient(var(--scene-ink) 1.6px,transparent 1.9px) 0 0/7px 7px; opacity:.38; mask-image:linear-gradient(140deg,black,transparent 40%,transparent 62%,black); }
  .print-tone::after { content:''; position:absolute; right:-10%; top:-10%; width:48%; height:75%; background:radial-gradient(var(--scene-paper) 1px,transparent 1.5px) 0 0/6px 6px; transform:rotate(-12deg); mask-image:linear-gradient(90deg,transparent,black); opacity:.4; }
</style>

