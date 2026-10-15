<script lang="ts" context="module">
  let visitPhoto = '';
</script>
<script lang="ts">
  import { onMount } from 'svelte';
  export let onScene: (photo:string, frame:{x:number;y:number;w:number;h:number}) => void = () => {};
  let scene: HTMLDivElement;
  let photo = '';
  let frame = {x:0,y:0,w:1000,h:1000};
  let toneStops = { r:'.015 .025 .06 .17 .48', g:'.025 .13 .35 .65 .98', b:'.28 .59 .9 1 1' };
  let reflectionColor = [.4,1,1];
  let sourceImage: HTMLImageElement | undefined;
  const photos = ['bench.jpg','bluemountain.jpg','Jamaica.jpg','strawsburg.jpg','coloseeum.jpg','IMG_20230730_211429627_HDR.jpg','IMG_20230725_172908282.jpg','kyoto.jpg','philly.jpg','kaiyukan.jpg','poconos.jpg','tokyo-flame.jpg','tokyo-skyline.jpg','wooded-lake.jpg','gateway-arch.jpg'];
  const dimensions: Record<string,[number,number]> = {"bench.jpg": [1702, 1276], "bluemountain.jpg": [2560, 1152], "coloseeum.jpg": [1970, 1003], "gateway-arch.jpg": [687, 2254], "IMG_20230725_172908282.jpg": [671, 1247], "IMG_20230730_211429627_HDR.jpg": [4000, 2250], "Jamaica.jpg": [1782, 1276], "kaiyukan.jpg": [1350, 1793], "kyoto.jpg": [1350, 1016], "philly.jpg": [1350, 759], "poconos.jpg": [1350, 759], "strawsburg.jpg": [718, 1276], "tokyo-flame.jpg": [1350, 916], "tokyo-skyline.jpg": [1350, 1016], "wooded-lake.jpg": [1350, 759]};
  const focal: Record<string,[number,number]> = {
    'bench.jpg':[.45,.52], 'bluemountain.jpg':[.55,.38], 'Jamaica.jpg':[.52,.6], 'strawsburg.jpg':[.48,.48],
    'coloseeum.jpg':[.36,.64], 'IMG_20230730_211429627_HDR.jpg':[.5,.55], 'IMG_20230725_172908282.jpg':[.48,.42],
    'kyoto.jpg':[.3,.48], 'philly.jpg':[.28,.52], 'kaiyukan.jpg':[.5,.54], 'poconos.jpg':[.4,.65],
    'tokyo-flame.jpg':[.5,.61], 'tokyo-skyline.jpg':[.52,.63], 'wooded-lake.jpg':[.58,.61], 'gateway-arch.jpg':[.51,.46]
  };
  function crop() {
    if(!sourceImage) return;
    const {width,height}=scene.getBoundingClientRect();
    const scale=Math.max(width/sourceImage.naturalWidth,height/sourceImage.naturalHeight);
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
    const canvas=document.createElement('canvas'); canvas.width=64; canvas.height=64;
    const ctx=canvas.getContext('2d'); if(!ctx) return;
    ctx.drawImage(image,0,0,64,64);
    const pixels=ctx.getImageData(0,0,64,64).data;
    const bins=new Array(36).fill(0);
    for(let i=0;i<pixels.length;i+=4) {
      const r=pixels[i]/255,g=pixels[i+1]/255,b=pixels[i+2]/255;
      const max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;
      if(delta<.08 || max<.12 || min>.9) continue;
      const h=max===r?((g-b)/delta+6)%6:max===g?(b-r)/delta+2:(r-g)/delta+4;
      bins[Math.floor(h*6)%36]+=delta*(1-Math.abs(max+min-1));
    }
    // Adjacent shades vote together so one broad photographic color wins.
    const scores=bins.map((weight,i)=>weight+bins[(i+35)%36]*.65+bins[(i+1)%36]*.65);
    const hue=scores.some(Boolean)?scores.indexOf(Math.max(...scores))*10+5:215;
    function rgb(s:number,l:number) {
      const a=s*Math.min(l,1-l);
      return [0,8,4].map(n=>{ const k=(n+hue/30)%12;return l-a*Math.max(-1,Math.min(k-3,9-k,1)); });
    }
    const stops=[[.86,.08],[.88,.21],[.85,.42],[.92,.66],[.95,.83]].map(([s,l])=>rgb(s,l));
    toneStops={r:stops.map(c=>c[0].toFixed(3)).join(' '),g:stops.map(c=>c[1].toFixed(3)).join(' '),b:stops.map(c=>c[2].toFixed(3)).join(' ')};
    reflectionColor=rgb(.9,.78);
    const root=scene.closest<HTMLElement>('.experiment');
    const colors: Record<string,string> = {
      '--scene-cyan':`hsl(${hue} 90% 78%)`, '--scene-blue':`hsl(${hue} 85% 43%)`,
      '--scene-ink':`hsl(${hue} 80% 9%)`, '--scene-light':`hsl(${hue} 95% 83%)`,
      '--scene-deep':`hsl(${hue} 88% 17%)`, '--scene-paper':'#f7ffff',
      '--gear-body':`hsl(${hue} 85% 56%)`, '--gear-vinyl':`hsl(${hue} 70% 11%)`,
      '--gear-label':`hsl(${hue} 90% 87%)`, '--menu-a':`hsl(${hue} 95% 84%)`,
      '--menu-b':`hsl(${hue} 90% 73%)`, '--menu-c':`hsl(${hue} 90% 90%)`
    };
    for(const [name,value] of Object.entries(colors)) root?.style.setProperty(name,value);
  }
  onMount(()=>{
    if(!visitPhoto) {
      let previous=''; try { previous=sessionStorage.getItem('pause-photo') ?? ''; } catch {}
      const ratio=scene.clientWidth/scene.clientHeight;
      const fitted=photos.filter(name=>{
        const [w,h]=dimensions[name];
        return ratio>1.2 ? w/h>=1.15 : ratio<.85 ? w/h<=1.05 : true;
      });
      const pool=fitted.filter(name=>name!==previous);

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
  <svg class="filter-definitions" width="0" height="0"><defs>
    <filter id="pause-photo-tone" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values=".2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0"/>
      <feComponentTransfer>
        <feFuncR type="table" tableValues={toneStops.r}/>
        <feFuncG type="table" tableValues={toneStops.g}/>
        <feFuncB type="table" tableValues={toneStops.b}/>
      </feComponentTransfer>
    </filter>
    <filter id="water-ceiling"><feTurbulence type="fractalNoise" baseFrequency=".012 .045" numOctaves="2" seed="14"/><feColorMatrix type="matrix" values={'0 0 0 0 '+reflectionColor[0]+' 0 0 0 0 '+reflectionColor[1]+' 0 0 0 0 '+reflectionColor[2]+' 0 0 0 6 -3'}/><feGaussianBlur stdDeviation=".7"/></filter>
  </defs></svg>
  <div class="architecture" style:background-image={photo ? `url("${photo}")` : 'none'}></div>
  <div class="tonal-depth"></div><div class="color-mask"></div>
  <div class="surface-reflection" style:background-image={photo ? `url("${photo}")` : 'none'}></div>
  <svg class="water-ceiling" viewBox="0 0 1000 240" preserveAspectRatio="none"><rect x="-30" y="-20" width="1060" height="280" filter="url(#water-ceiling)"/></svg>
  <div class="white-field"></div>
  <div class="white-scene" style:background-image={photo ? `url("${photo}")` : 'none'}></div>
  <div class="name-cutout"><svg class="nameplate" viewBox="0 0 300 1000" preserveAspectRatio="none"><text transform="translate(245 -8) rotate(90)" textLength="1016" lengthAdjust="spacingAndGlyphs">NATEY KIM</text></svg></div>
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
  .depth-scene { background:linear-gradient(180deg,var(--scene-light) 0%,var(--scene-blue) 42%,var(--scene-deep) 100%); }
  .architecture { opacity:.6; filter:url(#pause-photo-tone); mix-blend-mode:luminosity; }
  .tonal-depth { background:linear-gradient(180deg,color-mix(in srgb,var(--scene-light) 24%,transparent) 0%,color-mix(in srgb,var(--scene-blue) 27%,transparent) 35%,color-mix(in srgb,var(--scene-deep) 47%,transparent) 65%,color-mix(in srgb,var(--scene-deep) 91%,transparent) 100%); }
  .color-mask { opacity:.13; }
  .surface-reflection { filter:url(#pause-photo-tone) contrast(1.6); opacity:.16; }
  .white-field,.white-scene { position:absolute; inset:0; clip-path:polygon(0 0,var(--divide-top,35%) 0,var(--divide-bottom,20%) 100%,0 100%); }
  .white-field { background:linear-gradient(155deg,#fff 0%,#f6fcff 67%,color-mix(in srgb,var(--scene-cyan) 38%,white) 100%); }
  .white-scene { background-position:var(--photo-position,center); background-size:var(--photo-size,cover); filter:grayscale(1) contrast(2); opacity:.07; }
  .water-ceiling { position:absolute; top:-2%; left:0; width:100%; height:29%; opacity:.5; mix-blend-mode:screen; mask-image:linear-gradient(180deg,#000 0%,#000b 50%,transparent 100%); transform-origin:50% 0; animation:water-drift 18s ease-in-out infinite alternate; }
  .red-refractions { position:absolute; inset:0; width:100%; height:100%; fill:#f52248; opacity:.8; clip-path:polygon(0 0,var(--divide-top,35%) 0,var(--divide-bottom,20%) 100%,0 100%); }
  .red-refractions .inset { fill:#ffe7ed; opacity:.75; }
  .volume-light { background:radial-gradient(ellipse at 65% -8%,color-mix(in srgb,var(--scene-light) 47%,transparent),transparent 58%); }
  .print-tone { opacity:.1; }
  @keyframes water-drift { to { transform:translate(1.5%,1%) scale(1.04,.92); opacity:.65; } }
  @media(prefers-reduced-motion:reduce) { .water-ceiling { animation:none; } }
  .name-cutout { position:absolute; inset:0; overflow:hidden; clip-path:polygon(0 0,var(--divide-top,35%) 0,var(--divide-bottom,20%) 100%,0 100%); }
  .nameplate { position:absolute; left:-1%; top:0; width:clamp(140px,19vw,420px); height:100%; overflow:visible; fill:#000; font:italic 900 260px var(--font-display); letter-spacing:-.045em; }
  @media(orientation:portrait) { .nameplate { width:clamp(115px,25vw,230px); } }
</style>
