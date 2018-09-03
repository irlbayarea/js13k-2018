import { Sheet } from './music';
import { audioContext } from './theme';
import { Note } from './theory';

// const decayConst: number = 0.001;
export class GameSound {
  private readonly ons: OscillatorNode[] = [];
  private readonly gn: GainNode = audioContext.createGain();
  private readonly ad: AudioDestinationNode = audioContext.destination;
  constructor(
    private readonly otype: OscillatorType = 'sawtooth',
    private nreg: number = 1
  ) {
    // Start out muted (so we don't kill everyone's ears)
    this.gn.gain.setValueAtTime(0, 0);
    // Set number of registers required for this sheet music by this song
    this.register(nreg);
  }

  /*
    * Set instrument to play music defined in a SheetMusic object
    */
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

  public stop(): void {
    this.gn.disconnect(this.ad);
  }

  // Create Registers <=> Oscillators
  private register(n: number) {
    // Disconnect exisiting oscillators
    this.ons.forEach((on, _) => {
      on.disconnect();
    });

    this.nreg = n;

    // AudioContext -> Oscillators -> Gain Nodes -> WaveShape -> AudioDestination
    for (let i = 0; i < this.nreg; i++) {
      this.ons[i] = audioContext.createOscillator();
      this.ons[i].type = this.otype;
      this.ons[i].connect(this.gn);
      this.ons[i].start();
    }
  }
}
