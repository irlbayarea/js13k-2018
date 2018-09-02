import { Sheet } from './music';
import { audioContext } from './themesong';
import { Note } from './theory';

export class Instrument {
  private readonly ons: OscillatorNode[] = [];
  private readonly gn: GainNode = audioContext.createGain();
  private readonly ad: AudioDestinationNode = audioContext.destination;
  constructor(
    private readonly otype: OscillatorType = 'sawtooth',
    private nreg: number = 1
  ) {
    // Start out muted (so we don't kill everyone's ears)
    this.gn.gain.value = 0;
    // Set number of registers required for this sheet music by this song
    this.createRegisters(nreg);
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
    const t: number[] = new Array(sm.numRegisters()).fill(t0 + dt);

    // Set the music
    // For each register in the SheetMusic object...
    Object.keys(sm.registers).forEach((vali: string, i: number) => {
      // For each Note in the register...
      sm.registers[+vali].forEach((valj: Note, _) => {
        // Set frequency
        const f = valj.freq();
        const b = valj.duration(sm.tempo);
        if (f <= 0) {
          this.ons[i].frequency.setValueAtTime(0, t[i]);
          this.gn.gain.setValueAtTime(0, t[i]);
        } else {
          this.ons[i].frequency.setValueAtTime(f, t[i]);
          this.gn.gain.setValueAtTime(valj.volume, t[i]);
        }

        // Advance time and set oscillator frequency to zero
        t[i] += b;
        this.ons[i].frequency.setValueAtTime(0, t[i] - b * valj.sPct);
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
  private createRegisters(n: number) {
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
