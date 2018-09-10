import { audioContext } from './audio';
import { Sheet } from './music';
import { Note } from './theory';

export class GameSound {
  public readonly ons: OscillatorNode[] = [];
  public readonly wn: WaveShaperNode = audioContext.createWaveShaper();
  public readonly gn: GainNode = audioContext.createGain();
  public readonly ad: AudioDestinationNode = audioContext.destination;

  public keysDown: { [k: string]: boolean } = { '': false };

  constructor(
    public readonly numOsc: number = 1,
    public readonly ltype: OscillatorType[] = ['sawtooth'],
    public readonly gainC: number[] = [0.0015], // tslint:disable-line:no-magic-numbers
    public readonly freqC: number[] = [0.15], // tslint:disable-line:no-magic-numbers
    public readonly freq: number[] = [642], // tslint:disable-line:no-magic-numbers
    public readonly keys: string[] = [''],
    public readonly vol: number = 1,
    public readonly dur: number = 1
  ) {
    for (let i = 0; i < this.numOsc; i++) {
      this.ons[i] = audioContext.createOscillator();
      this.ons[i].frequency.value = freq[i] === undefined ? 0 : freq[i]; // tslint:disable-line:no-magic-numbers
      this.ons[i].type = ltype[i] === undefined ? 'sawtooth' : ltype[i];
      this.ons[i].start();
      this.ons[i].connect(this.wn);
    }
    this.gn.gain.setValueAtTime(0, audioContext.currentTime);
    this.wn.connect(this.gn);
    this.gn.connect(this.ad);
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
        // Set frequency & gain for this Note
        const f = nj.freq();
        const b = nj.duration(sm.tempo);
        this.ons[i].frequency.setTargetAtTime(
          f <= 0 ? 0 : f,
          t[i],
          sm.freqConst()
        );
        this.gn.gain.setTargetAtTime(f <= 0 ? 0 : nj.vol, t[i], sm.gainConst());

        // Advance time and set oscillator frequency to zero
        t[i] += b;

        // Turn Note off after specified duration
        this.gn.gain.setTargetAtTime(0, t[i] - b * nj.sPct, sm.gainConst());
        this.ons[i].frequency.setTargetAtTime(
          0,
          t[i] - b * nj.sPct,
          sm.freqConst()
        );
        // tslint:enable:no-magic-numbers
      });
    });
  }

  public play(): void {
    this.gn.connect(this.ad);
  }

  public stop(t0: number): void {
    this.gn.disconnect(this.ad);
    this.gn.gain.cancelScheduledValues(t0);
    this.gn.gain.setValueAtTime(0, t0);
    this.ons.forEach((on, _) => {
      on.frequency.cancelScheduledValues(t0);
      on.frequency.setValueAtTime(0, t0);
    });
  }
}

export const fireKey: string = 'P';

// tslint:disable:no-magic-numbers
const pew: GameSound = new GameSound(
  3,
  ['sine', 'square', 'sawtooth'],
  new Array(3).fill(0.08),
  new Array(3).fill(0.1),
  [642, 642 * 2, 642 / 2],
  [fireKey],
  0.5,
  0.08
); // tslint:enable:no-magic-numbers

export function fireLaser(): void {
  const t0: number = audioContext.currentTime;

  pew.ons.forEach((on, i) => {
    pew.gn.gain.setValueAtTime(pew.vol, t0);
    on.frequency.setValueAtTime(pew.freq[i], t0);

    pew.gn.gain.setTargetAtTime(0, t0 + pew.dur, pew.gainC[i]);
    on.frequency.setTargetAtTime(0, t0 + pew.dur, pew.freqC[i]);
  });
}
