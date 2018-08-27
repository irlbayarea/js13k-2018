// import { logDebug } from '../logger';

const REST: string = 'R';
const DOT: string = 'd';
const SHARP: string = '#';
const FLAT: string = 'b';
const SEC_PER_MIN: number = 60;
const BEATS_PER_MEASURE: number = 4;

// tslint:disable:no-magic-numbers
const noteValues: { [note: string]: number } = {
  A: 69,
  B: 71,
  C: 60,
  D: 62,
  E: 64,
  F: 65,
  G: 67,
}; // tslint:enable:no-magic-numbers

// tslint:disable:no-magic-numbers
const beatValues: { [beat: string]: number } = {
  e: 1 / Math.pow(2, 3), // Eighth
  h: 1 / Math.pow(2, 1), // Half
  q: 1 / Math.pow(2, 2), // Quarter
  s: 1 / Math.pow(2, 4), // Sixteenth
  t: 1 / Math.pow(2, 5), // Thirty-second
  w: 1 / Math.pow(2, 0), // Whole
}; // tslint:enable:no-magic-numbers

// tslint:disable:no-magic-numbers
/*
* Frequency (Hz) of indicated note and octave
*
* Note can be letter plus sharp(#) or flat(b) symbol
*/
export function noteToFreq(note: string = REST, octave: number = 0): number {
  if (note === REST) {
    return 0;
  } else {
    const base: string = note.substr(0, 1);
    let m: number =
      Object.keys(noteValues).find(key => base === key) !== undefined
        ? noteValues[base]
        : noteValues.C;
    if (note.length > 1) {
      if (note.substr(1, 1) === SHARP) {
        m += 1;
      } else if (note.substr(1, 1) === FLAT) {
        m -= 1;
      }
    }
    return Math.pow(2, (m + -69) / 12 + (octave - 4)) * 440;
  }
} // tslint:enable:no-magic-numbers

/*
* Number of whole notes represented by "beatString"
* 
* Example: 'qdd' reqpresents a double-dotted quarter note,
*           and would return 1/4 + (1/4)(1/2) + (1/4)(1/2)(1/2) = 7/16
*/
export function stringToBeats(beatString: string) {
  // First character is the base beat value
  const beat: string = beatString.substr(0, 1);

  // Count the number of DOT characters
  let dots: number = 0;
  beatString.split('').forEach((val, _) => {
    dots += val === DOT ? 1 : 0;
  });

  // Calculate total length of beat
  return Object.keys(beatValues).find(key => beat === key) !== undefined
    ? beatValues[beat] * (2 - 1 / Math.pow(2, dots))
    : 0;
}

// Helper function
export function str2Note(noteString: string): Note {
  return new Note(...noteString.split('|'));
}

/*
* Note Class
* 
* Encapsulates information about a single note/rest
*/
export class Note {
  constructor(
    public readonly note: string = REST,
    public readonly octave: number = 0,
    public readonly beat: string = 'q'
  ) {}

  public freq(): number {
    return noteToFreq(this.note, this.octave);
  }

  public beats(): number {
    return stringToBeats(this.beat);
  }

  public duration(tempo: number) {
    return (SEC_PER_MIN / tempo) * this.beats() * BEATS_PER_MEASURE;
  }
}

export class SheetMusic {
  constructor(
    public readonly tempo: number = 120,
    public readonly registers: { [id: number]: Note[] }
  ) {}

  public numRegisters(): number {
    return Object.keys(this.registers).length;
  }
}

export class Instrument {
  private ons: OscillatorNode[] = [];
  private readonly dn: WaveShaperNode = this.ac.createWaveShaper();
  private readonly gn: GainNode = this.ac.createGain();
  private readonly ad: AudioDestinationNode = this.ac.destination;

  constructor(
    private readonly ac: AudioContext,
    private numNotes = 6,
    private readonly oscType: OscillatorType = 'sawtooth'
  ) {
    this.ac = ac;
    this.createRegisters(this.numNotes);
    this.dn.connect(this.gn);
  }

  public learnMusic(sm: SheetMusic) {
    // Keeps track of time
    const t: number[] = new Array(sm.numRegisters()).fill(this.ac.currentTime);

    // Set number of registers required for this sheet music by this song
    this.createRegisters(sm.numRegisters());

    // Set the music
    // For each register in the SheetMusic object...
    Object.keys(sm.registers).forEach((vali: string, _) => {
      // For each Note in the register...
      sm.registers[+vali].forEach((valj: Note, j: number) => {
        // Set frequency
        this.ons[j].frequency.setValueAtTime(valj.freq(), t[j]);

        // Advance time and set oscillator frequency to zero
        t[j] += valj.beats();
        this.ons[j].frequency.setValueAtTime(0, t[j]);
      });
    });
  }

  public setFreqs(notes: Note[], tempo: number = 120): void {
    // Set freq of given notes and connect to graph
    for (let i = 0; i < Math.min(notes.length, this.numNotes); i++) {
      this.ons[i].frequency.setValueAtTime(
        notes[i].freq(),
        this.ac.currentTime
      );
      this.ons[i].frequency.setValueAtTime(
        0,
        // tslint:disable-next-line:no-magic-numbers
        this.ac.currentTime + notes[i].duration(tempo)
      );

      this.ons[i].connect(this.dn);
    }
    // If any notes left out, set freq to 0 and disconnect from graph
    for (let i = Math.min(notes.length, this.numNotes); i < notes.length; i++) {
      this.ons[i].frequency.setValueAtTime(0, this.ac.currentTime);
      // this.ons[i].disconnect();
    }
  }

  public play(): void {
    this.gn.connect(this.ad);
  }

  public stop(): void {
    this.gn.disconnect(this.ad);
  }

  private createRegisters(n: number) {
    this.numNotes = n;
    this.ons = [];
    for (let i = 0; i < this.numNotes; i++) {
      this.ons[i] = this.ac.createOscillator();
      this.ons[i].type = this.oscType;
      this.ons[i].connect(this.dn);
      this.ons[i].start();
    }
  }
}
