import { IOncePerPress, oncePerPress } from '../input/input';
import { audioContext } from './audio';
import { Sheet } from './music';
import { Note } from './theory';

export class GameSound implements IOncePerPress {
  public readonly ons: OscillatorNode[] = [];
  public readonly wn: WaveShaperNode = audioContext.createWaveShaper();
  public readonly gn: GainNode = audioContext.createGain();
  public readonly ad: AudioDestinationNode = audioContext.destination;

  public keysDown: { [k: string]: boolean } = { '': false };

  constructor(
    public readonly numOsc: number = 1,
    public readonly ltype: OscillatorType[] = ['sawtooth'],
    public readonly onC: number[] = [0.0015], // tslint:disable-line:no-magic-numbers
    public readonly offC: number[] = [0.15], // tslint:disable-line:no-magic-numbers
    public readonly freq: number[] = [642], // tslint:disable-line:no-magic-numbers
    public readonly keys: string[] = ['']
  ) {
    for (let i = 0; i < this.numOsc; i++) {
      this.ons[i] = audioContext.createOscillator();
      this.ons[i].frequency.value = freq[i] === undefined ? 642 : freq[i]; // tslint:disable-line:no-magic-numbers
      this.ons[i].type = ltype[i] === undefined ? 'sawtooth' : ltype[i];
      this.ons[i].start();
      this.ons[i].connect(this.wn);
    }
    this.gn.gain.setValueAtTime(0, audioContext.currentTime);
    this.wn.connect(this.gn);
    this.gn.connect(this.ad);
  }

  public keyDownEvent(k: string, t0: number) {
    if (k === this.keys[0]) {
      this.ons.forEach((on, i) => {
        on.frequency.setTargetAtTime(this.freq[i], t0, this.onC[i]);
        this.gn.gain.setTargetAtTime(1, t0, this.onC[i]);
      });
    }
  }

  public keyUpEvent(k: string, t0: number) {
    if (k === this.keys[0]) {
      this.ons.forEach((on, i) => {
        on.frequency.setTargetAtTime(0, t0, this.offC[i]);
        this.gn.gain.setTargetAtTime(0, t0, this.offC[i]);
      });
    }
  }

  public playSheet(
    sm: Sheet,
    dt: number = 0.0,
    t0: number = audioContext.currentTime
  ) {
    // Keeps track of time
    const t: number[] = new Array(sm.nreg()).fill(t0 + dt);

    // Set the music
    // For each register in the SheetMusic object...
    Object.keys(sm.registers).forEach((ri: string, i: number) => {
      // For each Note in the register...
      sm.registers[+ri].forEach((nj: Note, _) => {
        // Set frequency
        const f = nj.freq();
        const b = nj.duration(sm.tempo);
        // tslint:disable-next-line:no-magic-numbers
        this.ons[i].frequency.setValueAtTime(f <= 0 ? 0 : f, t[i]);
        // tslint:disable-next-line:no-magic-numbers
        this.gn.gain.exponentialRampToValueAtTime(f <= 0 ? 1e-3 : nj.vol, t[i]); // , decayConst);

        // Advance time and set oscillator frequency to zero
        t[i] += b;
        // tslint:disable-next-line:no-magic-numbers
        this.ons[i].frequency.setValueAtTime(0, t[i] - b * nj.sPct);
      });
    });
  }

  public play(): void {
    this.gn.connect(this.ad);
  }

  public stop(t0: number): void {
    this.gn.disconnect(this.ad);
    this.gn.gain.setValueAtTime(0, t0);
    this.ons.forEach((on, _) => {
      on.frequency.cancelScheduledValues(t0);
      on.frequency.setValueAtTime(0, t0);
    });
  }
}

export const fireKey: string = 'P';

// tslint:disable:no-magic-numbers
const pewpew: GameSound = new GameSound(
  3,
  ['sine', 'square', 'sawtooth'],
  new Array(3).fill(0.0015),
  new Array(3).fill(0.15),
  [642, 642 * 2, 642 / 2],
  [fireKey]
); // tslint:enable:no-magic-numbers

// Play a Laser (l) sound while pressing a key (k)
export function fireLaser() {
  oncePerPress(pewpew, audioContext.currentTime);
}