<script lang="ts" context="module">
  let visitPhoto = '';
</script>
<script lang="ts">
  import { onMount } from 'svelte';
  export let onScene: (photo:string, frame:{x:number;y:number;w:number;h:number}) => void = () => {};
  let scene: HTMLDivElement;
  let photo = '';
  let frame = {x:0,y:0,w:1000,h:1000};
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
    frame={x:left/width*1000,y:top/height*1000,w:w/width*1000,h:h/height*1000};
    onScene(photo,frame);
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
    root?.style.setProperty('--scene-light',`hsl(${(hue+8)%360} 95% 73%)`);
    root?.style.setProperty('--scene-deep',`hsl(${(hue+345)%360} 80% 8%)`);
    root?.style.setProperty('--gear-body',`hsl(${hue} 72% 53%)`);
    root?.style.setProperty('--gear-vinyl',`hsl(${hue} 60% 13%)`);
    root?.style.setProperty('--gear-label',`hsl(${(hue+25)%360} 80% 78%)`);
    root?.style.setProperty('--menu-a',`hsl(${hue} 75% 86%)`);
    root?.style.setProperty('--menu-b',`hsl(${(hue+25)%360} 70% 82%)`);
    root?.style.setProperty('--menu-c',`hsl(${(hue+335)%360} 65% 90%)`);
    scene.style.setProperty('--photo-shadow',`hsl(${hue} 55% 12% / .83)`);
    scene.style.setProperty('--photo-accent',`hsl(${hue} 80% 80%)`);
  }
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
  <div class="architecture" style:background-image={photo ? `url("${photo}")` : 'none'}></div>
  <div class="tonal-depth"></div><div class="color-mask"></div>
  <div class="surface-reflection" style:background-image={photo ? `url("${photo}")` : 'none'}></div>
  <div class="volume-light"></div><div class="reading-shadow"></div><div class="print-tone"></div>
</div>
<style>
  .depth-scene { --dx:0px; --dy:0px; position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; isolation:isolate; background:var(--scene-blue); }
  .architecture { position:absolute; inset:0; background-position:var(--photo-position,center); background-size:var(--photo-size,cover); background-repeat:no-repeat; opacity:.35; transform:translate(var(--dx),var(--dy)) scale(1.03); transition:transform 650ms ease-out; mask-image:linear-gradient(180deg,#0008,#000 35%,#0008 70%,transparent); }
  .tonal-depth { position:absolute; inset:0; background:radial-gradient(ellipse at 38% -15%,color-mix(in srgb,var(--scene-light,var(--scene-cyan)) 85%,transparent),transparent 67%),linear-gradient(180deg,transparent 8%,color-mix(in srgb,var(--scene-blue) 50%,transparent) 42%,var(--scene-deep,var(--scene-ink)) 100%); }
  .color-mask { position:absolute; inset:0; background:var(--scene-ink); opacity:.32; clip-path:polygon(var(--divide-top,35%) 0,100% 0,100% 100%,var(--divide-bottom,20%) 100%); }
  /* Reflected detail from the same photograph supplies the ceiling texture. */
  .surface-reflection { position:absolute; inset:-8% -8% 47%; background-size:cover; background-position:50% 55%; mix-blend-mode:screen; opacity:.18; filter:grayscale(1) contrast(2.4); mask-image:linear-gradient(180deg,transparent 0%,#0006 25%,#0008 50%,transparent 100%); transform:scaleY(-.65) skewX(-14deg); animation:reflection-drift 18s ease-in-out infinite alternate; }
  .volume-light { position:absolute; inset:-10%; background:radial-gradient(ellipse at 36% -8%,color-mix(in srgb,var(--scene-light,var(--scene-cyan)) 52%,transparent),transparent 58%); mix-blend-mode:screen; animation:light-breathe 14s ease-in-out infinite alternate; }
  .reading-shadow { position:absolute; inset:0; background:radial-gradient(ellipse at 53% 60%,#0008,transparent 52%); opacity:.3; }
  .print-tone { position:absolute; inset:0; background:radial-gradient(var(--scene-ink) .9px,transparent 1.3px) 0 0/6px 6px; opacity:.16; mask-image:linear-gradient(145deg,black,transparent 45%,transparent 75%,black); }
  @keyframes reflection-drift { to { transform:translate(2%,1%) scaleY(-.7) skewX(-10deg); opacity:.25; } }
  @keyframes light-breathe { to { transform:translate(2%,1%); opacity:.72; } }
  @media(prefers-reduced-motion:reduce) { .surface-reflection,.volume-light { animation:none; } .architecture { transform:none; transition:none; } }
</style>
