import { state } from './../../index';
import { audioContext } from './themesong';
import { A440 } from './theory';

let keyDown = false;

const on: OscillatorNode = audioContext.createOscillator();
on.frequency.value = A440;
on.type = 'sawtooth';
on.start();
const gn: GainNode = audioContext.createGain();
on.connect(gn);
const ad: AudioDestinationNode = audioContext.destination;

export function makesomenoise() {
  // Pew Pew!
  if (state.input.isPressed('P') && !keyDown) {
    keyDown = true;
    gn.connect(ad);
  } else if (!state.input.isPressed('P') && keyDown) {
    keyDown = false;
    gn.disconnect(ad);
  }
}
