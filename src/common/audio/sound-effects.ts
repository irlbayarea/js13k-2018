import { state } from '../../index';
import { audioContext } from './theme';

let keyDown = false;

const onTimeConst: number = 0.0015;
const offTimeConst: number = 0.15;
const laserFreq: number = 642;

const on: OscillatorNode = audioContext.createOscillator();
on.frequency.value = laserFreq;
on.type = 'square';
on.start();
const wn: WaveShaperNode = audioContext.createWaveShaper();
on.connect(wn);
const gn: GainNode = audioContext.createGain();
gn.gain.setValueAtTime(0, audioContext.currentTime);
wn.connect(gn);
const ad: AudioDestinationNode = audioContext.destination;
gn.connect(ad);

export function makeSomeNoise() {
  // Pew Pew!
  if (state.input.isPressed('P') && !keyDown) {
    keyDown = true;
    on.frequency.setTargetAtTime(
      laserFreq,
      audioContext.currentTime,
      onTimeConst
    );
    gn.gain.setTargetAtTime(1, audioContext.currentTime, onTimeConst);
  } else if (!state.input.isPressed('P') && keyDown) {
    keyDown = false;
    on.frequency.setTargetAtTime(0, audioContext.currentTime, offTimeConst);
    gn.gain.setTargetAtTime(0, audioContext.currentTime, offTimeConst);
  }
}
