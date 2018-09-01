import { Note, SheetMusic } from './music';

export class Instrument {
  private readonly ons: OscillatorNode[] = [];
  private readonly dn: WaveShaperNode = this.ac.createWaveShaper();
  private readonly gns: GainNode[] = [];
  private readonly ad: AudioDestinationNode = this.ac.destination;

  constructor(
    private readonly ac: AudioContext,
    private numRegisters = 1,
    private readonly oscType: OscillatorType = 'sawtooth',
    private volume: number = 0.1
  ) {
    this.ac = ac;
    this.createRegisters(this.numRegisters);
  }

  /*
    * Set instrument to play music defined in a SheetMusic object
    */
  public learnMusic(sm: SheetMusic) {
    // Keeps track of time
    const t0: number = this.ac.currentTime;
    const t: number[] = new Array(sm.numRegisters()).fill(t0);

    // Set number of registers required for this sheet music by this song
    this.volume = sm.volume;
    this.createRegisters(sm.numRegisters());

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
        } else {
          this.ons[i].frequency.setValueAtTime(f, t[i]);
        }

        // Advance time and set oscillator frequency to zero
        t[i] += b;
        this.ons[i].frequency.setValueAtTime(
          0,
          t[i] - b * valj.staccacoPercent
        );
      });
    });
  }

  /*
    * Set the frequency to a particular note
    */
  public setFreqs(notes: Note[], tempo: number = 120): void {
    // Set freq of given notes and connect to graph
    for (let i = 0; i < Math.min(notes.length, this.numRegisters); i++) {
      this.ons[i].frequency.setValueAtTime(
        notes[i].freq(),
        this.ac.currentTime
      );
      this.ons[i].frequency.setValueAtTime(
        0,
        // tslint:disable-next-line:no-magic-numbers
        this.ac.currentTime + notes[i].duration(tempo)
      );
    }
    // If any notes left out, set freq to 0 and set volume to 0
    this.ons.forEach((on, i) => {
      if (i >= Math.min(notes.length, this.numRegisters) && i < notes.length) {
        on.frequency.setValueAtTime(0, this.ac.currentTime);
        this.gns[i].gain.value = 0;
        this.gns[i].disconnect(this.ad);
      }
    });
  }

  public play(): void {
    this.gns.forEach((gn, _) => {
      gn.connect(this.ad);
    });
  }

  public stop(): void {
    this.gns.forEach((gn, _) => {
      gn.disconnect(this.ad);
    });
  }

  // Create Registers <=> Oscillators
  private createRegisters(n: number) {
    // Disconnect exisiting oscillators
    // TODO: can I just remove them from the AudioContext?
    this.ons.forEach((on, _) => {
      on.disconnect();
    });

    this.numRegisters = n;

    for (let i = 0; i < this.numRegisters; i++) {
      this.ons[i] = this.ac.createOscillator();
      this.ons[i].type = this.oscType;
      this.gns[i] = this.ac.createGain();
      this.gns[i].gain.value = this.volume;
      this.dn.connect(this.gns[i]);
      this.ons[i].connect(this.gns[i]);
      this.ons[i].start();
    }
  }
}
