import { IOncePerPress, oncePerPress } from '../input/input';
import { audioContext } from './theme';

export const fireKey: string = 'P';
export class SoundEffect implements IOncePerPress {
  public readonly on: OscillatorNode = audioContext.createOscillator();
  public readonly wn: WaveShaperNode = audioContext.createWaveShaper();
  public readonly gn: GainNode = audioContext.createGain();
  public readonly ad: AudioDestinationNode = audioContext.destination;

  public keyDown: boolean = false;

  constructor(
    ltype: OscillatorType = 'square',
    public readonly f: number = 642,
    public readonly onC: number = 0.0015,
    public readonly offC: number = 0.15,
    public readonly key: string = fireKey
  ) {
    this.on.frequency.value = f;
    this.on.type = ltype;
    this.on.start();
    this.on.connect(this.wn);
    this.gn.gain.setValueAtTime(0, audioContext.currentTime);
    this.wn.connect(this.gn);
    this.gn.connect(this.ad);
  }

  public keyDownEvent(t0: number) {
    this.on.frequency.setTargetAtTime(this.f, t0, this.onC);
    this.gn.gain.setTargetAtTime(1, t0, this.onC);
  }

  public keyUpEvent(t0: number) {
    this.on.frequency.setTargetAtTime(0, t0, this.offC);
    this.gn.gain.setTargetAtTime(0, t0, this.offC);
  }
}

const pewpew: SoundEffect = new SoundEffect('sine');
const pippip: SoundEffect = new SoundEffect('square', pewpew.f * 2);
const powpow: SoundEffect = new SoundEffect('sawtooth', pewpew.f / 2);

// Play a Laser (l) sound while pressing a key (k)
export function fireLaser() {
  // Pew Pew!
  const t0: number = audioContext.currentTime;
  oncePerPress(pewpew, t0);
  oncePerPress(powpow, t0);
  oncePerPress(pippip, t0);
}
