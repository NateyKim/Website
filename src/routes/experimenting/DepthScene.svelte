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
  function palette() {
    const root=scene.closest<HTMLElement>('.experiment');
    const colors: Record<string,string> = {
      '--scene-cyan':'#64efff', '--scene-blue':'#1254dc', '--scene-ink':'#030d38',
      '--scene-light':'#8effff', '--scene-deep':'#07136b', '--scene-paper':'#f7ffff',
      '--gear-body':'#20bbf5', '--gear-vinyl':'#071740', '--gear-label':'#b3faff',
      '--menu-a':'#8ffaff', '--menu-b':'#40dfff', '--menu-c':'#bbffff'
    };
    for(const [name,value] of Object.entries(colors)) root?.style.setProperty(name,value);
  }
  onMount(()=>{
    if(!visitPhoto) {
      let previous=''; try { previous=sessionStorage.getItem('pause-photo') ?? ''; } catch {}
      const pool=photos.filter(name=>name!==previous);
      visitPhoto=pool[Math.floor(Math.random()*pool.length)];
      try { sessionStorage.setItem('pause-photo',visitPhoto); } catch {}
    }
    photo='/photosilike/'+visitPhoto;
    const image=new Image(); image.onload=()=>{ sourceImage=image; palette(); crop(); }; image.src=photo;
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
  <svg class="filter-definitions" width="0" height="0"><defs>
    <filter id="pause-photo-blue" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values=".2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0"/>
      <feComponentTransfer>
        <feFuncR type="table" tableValues=".015 .025 .06 .17 .48"/>
        <feFuncG type="table" tableValues=".025 .13 .35 .65 .98"/>
        <feFuncB type="table" tableValues=".28 .59 .9 1 1"/>
      </feComponentTransfer>
    </filter>
    <filter id="water-ceiling"><feTurbulence type="fractalNoise" baseFrequency=".012 .045" numOctaves="2" seed="14"/><feColorMatrix type="matrix" values="0 0 0 0 .4 0 0 0 0 1 0 0 0 0 1 0 0 0 6 -3"/><feGaussianBlur stdDeviation=".7"/></filter>
  </defs></svg>
  <div class="architecture" style:background-image={photo ? `url("${photo}")` : 'none'}></div>
  <div class="tonal-depth"></div><div class="color-mask"></div>
  <div class="surface-reflection" style:background-image={photo ? `url("${photo}")` : 'none'}></div>
  <svg class="water-ceiling" viewBox="0 0 1000 240" preserveAspectRatio="none"><rect x="-30" y="-20" width="1060" height="280" filter="url(#water-ceiling)"/></svg>
  <div class="white-field"></div>
  <div class="white-scene" style:background-image={photo ? `url("${photo}")` : 'none'}></div>
  <svg class="red-refractions" viewBox="0 0 1000 1000" preserveAspectRatio="none">
    <path d="M122 196L145 177L139 240L123 252Z"/><path d="M132 211L146 201L139 233Z" class="inset"/>
    <path d="M83 410L106 424L98 462L77 438Z"/><path d="M87 417L99 429L94 447Z" class="inset"/>
    <path d="M49 701L70 679L78 726L61 738Z"/><path d="M58 705L67 691L70 723Z" class="inset"/>
  </svg>
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
  .filter-definitions { position:absolute; }
  .depth-scene { background:linear-gradient(180deg,#42edff 0%,#1587f5 24%,#1343d5 58%,#061172 100%); }
  .architecture { opacity:.6; filter:url(#pause-photo-blue); mix-blend-mode:luminosity; }
  .tonal-depth { background:linear-gradient(180deg,#80ffff3d 0%,#0854eb44 35%,#0614ba77 65%,#020c68e8 100%); }
  .color-mask { opacity:.13; }
  .surface-reflection { filter:url(#pause-photo-blue) contrast(1.6); opacity:.16; }
  .white-field,.white-scene { position:absolute; inset:0; clip-path:polygon(0 0,var(--divide-top,35%) 0,var(--divide-bottom,20%) 100%,0 100%); }
  .white-field { background:linear-gradient(155deg,#fff 0%,#f6fcff 67%,#bce6fb 100%); }
  .white-scene { background-position:var(--photo-position,center); background-size:var(--photo-size,cover); filter:grayscale(1) contrast(2); opacity:.07; }
  .water-ceiling { position:absolute; top:-2%; left:0; width:100%; height:29%; opacity:.5; mix-blend-mode:screen; mask-image:linear-gradient(180deg,#000 0%,#000b 50%,transparent 100%); transform-origin:50% 0; animation:water-drift 18s ease-in-out infinite alternate; }
  .red-refractions { position:absolute; inset:0; width:100%; height:100%; fill:#f52248; opacity:.8; clip-path:polygon(0 0,var(--divide-top,35%) 0,var(--divide-bottom,20%) 100%,0 100%); }
  .red-refractions .inset { fill:#ffe7ed; opacity:.75; }
  .volume-light { background:radial-gradient(ellipse at 65% -8%,#85ffff77,transparent 58%); }
  .print-tone { opacity:.1; }
  @keyframes water-drift { to { transform:translate(1.5%,1%) scale(1.04,.92); opacity:.65; } }
  @media(prefers-reduced-motion:reduce) { .water-ceiling { animation:none; } }
</style>
