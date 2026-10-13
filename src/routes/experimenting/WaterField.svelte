<script lang="ts">
  import { onMount } from 'svelte';
  let canvas: HTMLCanvasElement;
  onMount(() => {
    const gl = canvas.getContext('webgl', { alpha:true, antialias:false, depth:false, preserveDrawingBuffer:false, powerPreference:'low-power' });
    if (!gl) return;
    const vertex = 'attribute vec2 position; void main(){gl_Position=vec4(position,0.0,1.0);}';
    const fragment = `
      precision mediump float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 pointer;
      vec2 hash(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
      void main(){
        vec2 uv=gl_FragCoord.xy/resolution;
        vec2 q=uv*vec2(6.0*resolution.x/resolution.y,6.0);
        q+=vec2(sin(q.y*.8+time*.25),cos(q.x*.7-time*.2))*.25;
        q+=pointer*.12;
        vec2 cell=floor(q),f=fract(q);
        float first=8.0,second=8.0;
        for(int y=-1;y<=1;y++){for(int x=-1;x<=1;x++){
          vec2 g=vec2(float(x),float(y)),h=hash(cell+g);
          vec2 point=.5+.32*sin(time*.35+6.2831*h);
          float d=length(g+point-f);
          if(d<first){second=first;first=d;}else if(d<second){second=d;}
        }}
        float caustic=1.0-smoothstep(.018,.075,second-first);
        float glint=pow(1.0-smoothstep(.0,.10,second-first),3.0);
        float surface=pow(uv.y,1.5);
        float light=(caustic*.10+glint*.10)*surface;
        gl_FragColor=vec4(vec3(.4,.85,1.0)*light,1.0);
      }
    `;
    function shader(type: number, source: string) {
      const item=gl!.createShader(type); if(!item)return null;
      gl!.shaderSource(item,source);gl!.compileShader(item);
      if(!gl!.getShaderParameter(item,gl!.COMPILE_STATUS)){gl!.deleteShader(item);return null;}return item;
    }
    const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);
    if(!vs||!fs){if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);return;}
    const program=gl.createProgram();if(!program)return;
    gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);return;}
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    gl.useProgram(program);
    const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const size=gl.getUniformLocation(program,'resolution'),clock=gl.getUniformLocation(program,'time'),cursor=gl.getUniformLocation(program,'pointer');
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0,last=0,px=0,py=0,stopped=false;
    function resize(){
      const rect=canvas.getBoundingClientRect();
      const scale=Math.min(.65,1024/Math.max(1,rect.width));
      canvas.width=Math.max(1,Math.round(rect.width*scale));canvas.height=Math.max(1,Math.round(rect.height*scale));
      gl!.viewport(0,0,canvas.width,canvas.height);draw(media.matches?0:performance.now());
    }
    function draw(now:number){
      gl!.useProgram(program);gl!.uniform2f(size,canvas.width,canvas.height);gl!.uniform1f(clock,media.matches?0:now*.001);gl!.uniform2f(cursor,media.matches?0:px,media.matches?0:py);gl!.drawArrays(gl!.TRIANGLES,0,6);
      canvas.dataset.frame=(media.matches?0:Math.floor(now)).toString();
    }
    function animate(now:number){
      if(stopped)return;
      if(now-last>=33){last=now;draw(now);}
      if(!media.matches&&!document.hidden)frame=requestAnimationFrame(animate);
    }
    function resume(){cancelAnimationFrame(frame);draw(media.matches?0:performance.now());if(!media.matches&&!document.hidden)frame=requestAnimationFrame(animate);}
    function move(event:PointerEvent){px=event.clientX/window.innerWidth-.5;py=event.clientY/window.innerHeight-.5;}
    const observer=new ResizeObserver(resize);observer.observe(canvas);resize();resume();
    media.addEventListener('change',resume);document.addEventListener('visibilitychange',resume);window.addEventListener('pointermove',move,{passive:true});
    return()=>{stopped=true;cancelAnimationFrame(frame);observer.disconnect();media.removeEventListener('change',resume);document.removeEventListener('visibilitychange',resume);window.removeEventListener('pointermove',move);if(buffer)gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);gl.getExtension('WEBGL_lose_context')?.loseContext();};
  });
</script>

<canvas class="water-field" bind:this={canvas} aria-hidden="true"></canvas>

<style>
  .water-field { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; mix-blend-mode:screen; opacity:.9; }
  @media(max-width:700px){.water-field{opacity:.7;}}
</style>
