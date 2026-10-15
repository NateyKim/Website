export type Cue = 'select' | 'confirm' | 'back' | 'close' | 'open';

export function createMenuAudio(initialEnabled = true) {
  let enabled = initialEnabled;
  let context: AudioContext | undefined;
  let master: GainNode;
  let noise: AudioBuffer;
  let lastSelect = -Infinity;

  function unlock() {
    if (!enabled) return;
    try {
      if (!context) {
        context = new AudioContext();
        master = context.createGain();
        master.gain.value = .28;
        master.connect(context.destination);
        noise = context.createBuffer(1, Math.ceil(context.sampleRate * .3), context.sampleRate);
        const data = noise.getChannelData(0);
        for (let i=0;i<data.length;i++) data[i] = Math.random()*2-1;
      }
      if (context.state === 'suspended') void context.resume().catch(() => {});
    } catch { /* Audio support must never prevent navigation. */ }
  }
  function tone(frequency:number, end:number, duration:number, gain:number, delay=0, type:OscillatorType='triangle') {
    if (!context) return;
    const now=context.currentTime+delay;
    const voice=context.createOscillator(), envelope=context.createGain();
    voice.type=type; voice.frequency.setValueAtTime(frequency,now);
    voice.frequency.exponentialRampToValueAtTime(end,now+duration);
    envelope.gain.setValueAtTime(0,now);
    envelope.gain.linearRampToValueAtTime(gain,now+.004);
    envelope.gain.exponentialRampToValueAtTime(.0001,now+duration);
    voice.connect(envelope); envelope.connect(master);
    voice.start(now); voice.stop(now+duration+.01);
    voice.onended=()=>{voice.disconnect();envelope.disconnect();};
  }
  function texture(start:number,end:number,duration:number,gain:number,delay=0) {
    if(!context) return;
    const now=context.currentTime+delay;
    const source=context.createBufferSource(),filter=context.createBiquadFilter(),envelope=context.createGain();
    source.buffer=noise; filter.type='bandpass'; filter.Q.value=.85;
    filter.frequency.setValueAtTime(start,now);filter.frequency.exponentialRampToValueAtTime(end,now+duration);
    envelope.gain.setValueAtTime(.0001,now);envelope.gain.linearRampToValueAtTime(gain,now+.002);
    envelope.gain.exponentialRampToValueAtTime(.0001,now+duration);
    source.connect(filter);filter.connect(envelope);envelope.connect(master);
    source.start(now);source.stop(now+duration+.005);
    source.onended=()=>{source.disconnect();filter.disconnect();envelope.disconnect();};
  }
  function servo(opening:boolean) {
    texture(opening?650:1300,opening?1100:550,.21,.19);
    tone(opening?95:130,opening?120:70,.15,.16,0,'sine');
    if(!opening) { texture(3800,2300,.025,.23,.21);tone(160,90,.035,.12,.21,'sine'); }
  }
  function play(cue:Cue) {
    if(!enabled || !context || context.state==='closed') return;
    if(cue==='select') {
      if(performance.now()-lastSelect<65) return;
      lastSelect=performance.now();
      texture(3100,2000,.048,.38);
      tone(170,110,.032,.15,0,'sine');
    } else if(cue==='confirm') {
      texture(4200,1800,.07,.4);
      tone(115,65,.065,.25,0,'sine');
      tone(530,500,.075,.065,.008,'sine');
      tone(2130,1980,.055,.035,.012,'sine');
    } else if(cue==='back') {
      texture(1500,700,.065,.28);
      tone(130,75,.065,.17,0,'sine');
    } else servo(cue==='open');
  }
  function setEnabled(value:boolean) {
    enabled=value;
    if(context && context.state!=='closed') {
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setValueAtTime(value ? .28 : 0,context.currentTime);
    }
    if(value) unlock();
  }
  function destroy() { if(context && context.state!=='closed') void context.close().catch(()=>{}); }
  return {unlock,play,setEnabled,destroy};
}
