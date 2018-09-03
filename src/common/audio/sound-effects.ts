import { state } from '../../index';
import { audioContext } from './theme';
export class Laser {
  public readonly on: OscillatorNode = audioContext.createOscillator();
  public readonly wn: WaveShaperNode = audioContext.createWaveShaper();
  public readonly gn: GainNode = audioContext.createGain();
  public readonly ad: AudioDestinationNode = audioContext.destination;

  public keyDown: boolean = false;

  constructor(
    ltype: OscillatorType = 'square',
    public readonly f: number = 642,
    public readonly onC: number = 0.0015,
    public readonly offC: number = 0.15
  ) {
    this.on.frequency.value = f;
    this.on.type = ltype;
    this.on.start();
    this.on.connect(this.wn);
    this.gn.gain.setValueAtTime(0, audioContext.currentTime);
    this.wn.connect(this.gn);
    this.gn.connect(this.ad);
  }
}

export const fireKey: string = 'P';

const pewpew: Laser = new Laser('sine');
const pippip: Laser = new Laser('square', pewpew.f * 2); // tslint:disable-line:no-magic-numbers
const powpow: Laser = new Laser('sine', pewpew.f / 2); // tslint:disable-line:no-magic-numbers

export function fire() {
  // Pew Pew!
  shoot(pewpew, fireKey);
  shoot(powpow, fireKey);
  shoot(pippip, fireKey);
}

// Play a Laser (l) sound by pressing a key (k)
function shoot(l: Laser, k: string) {
  const t0: number = audioContext.currentTime;
  if (state.input.isPressed(k) && !l.keyDown) {
    l.keyDown = true;
    l.on.frequency.setTargetAtTime(l.f, t0, l.onC);
    l.gn.gain.setTargetAtTime(1, t0, l.onC);
  } else if (!state.input.isPressed(k) && l.keyDown) {
    l.keyDown = false;
    l.on.frequency.setTargetAtTime(0, t0, l.offC);
    l.gn.gain.setTargetAtTime(0, t0, l.offC);
  }
}
