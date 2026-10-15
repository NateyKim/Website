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
  function servo(opening:boolean) {
    if(!context) return;
    const now=context.currentTime, source=context.createBufferSource();
    const filter=context.createBiquadFilter(), envelope=context.createGain();
    source.buffer=noise; filter.type='bandpass'; filter.Q.value=1.8;
    filter.frequency.setValueAtTime(opening?600:1400,now);
    filter.frequency.exponentialRampToValueAtTime(opening?1800:380,now+.21);
    envelope.gain.setValueAtTime(.0001,now);
    envelope.gain.linearRampToValueAtTime(.11,now+.025);
    envelope.gain.exponentialRampToValueAtTime(.0001,now+.23);
    source.connect(filter);filter.connect(envelope);envelope.connect(master);
    source.start(now);source.stop(now+.24);
    source.onended=()=>{source.disconnect();filter.disconnect();envelope.disconnect();};
    tone(opening?120:180,opening?200:85,.18,.15,0,'sine');
    if(!opening) tone(1600,900,.025,.1,.21);
  }
  function play(cue:Cue) {
    if(!enabled || !context || context.state==='closed') return;
    if(cue==='select') {
      if(performance.now()-lastSelect<65) return;
      lastSelect=performance.now();
      tone(1150,850,.045,.18);tone(2300,1900,.025,.055);
    } else if(cue==='confirm') {
      tone(660,990,.085,.22);tone(1320,1650,.09,.14,.035);
    } else if(cue==='back') {
      tone(880,440,.105,.2);tone(220,165,.09,.08,0,'sine');
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

