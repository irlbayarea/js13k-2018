// import { logDebug } from '../logger';

const REST: string = 'R';
const DOT: string = 'd';
const SHARP: string = '#';
const FLAT: string = 'b';

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
  e: 1 / 8,
  h: 1 / 2,
  q: 1 / 2,
  s: 1 / 16,
  t: 1 / 32,
  w: 1,
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
}
export class Instrument {
  private readonly ons: OscillatorNode[] = [];
  private readonly dn: WaveShaperNode = this.ac.createWaveShaper();
  private readonly gn: GainNode = this.ac.createGain();
  private readonly ad: AudioDestinationNode = this.ac.destination;

  constructor(
    private readonly ac: AudioContext,
    private readonly numNotes = 6,
    private readonly oscType: OscillatorType = 'sawtooth'
  ) {
    this.ac = ac;
    for (let i = 0; i < numNotes; i++) {
      this.ons[i] = this.ac.createOscillator();
      this.ons[i].type = this.oscType;
      this.ons[i].connect(this.dn);
      this.ons[i].start();
    }
    this.dn.connect(this.gn);
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
        this.ac.currentTime + tempo / 2 / 2 / 2 / 2 / 2 / 2
      );
      this.ons[i].connect(this.dn);
    }
    // If any notes left out, set freq to 0 and disconnect from graph
    for (let i = Math.min(notes.length, this.numNotes); i < notes.length; i++) {
      this.ons[i].frequency.setValueAtTime(0, this.ac.currentTime);
      this.ons[i].disconnect();
    }
  }

  public play(): void {
    this.gn.connect(this.ad);
  }

  public stop(): void {
    this.gn.disconnect(this.ad);
  }
}

// export class SheetMusic {
//   constructor(public readonly tempo: number = 120) {}
// }
