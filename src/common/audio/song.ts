import { logDebug } from '../logger';

// tslint:disable:no-magic-numbers
const noteValues: { [note: string]: number } = {
  A: 69,
  'A#': 70,
  Ab: 68,
  B: 71,
  'B#': 72,
  Bb: 70,
  C: 60,
  'C#': 61,
  Cb: 59,
  D: 62,
  'D#': 63,
  Db: 61,
  E: 64,
  'E#': 65,
  Eb: 63,
  F: 65,
  'F#': 66,
  Fb: 64,
  G: 67,
  'G#': 68,
  Gb: 66,
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
export function noteToFreq(note: string, octave: number): number {
  const m: number =
    Object.keys(noteValues).find(key => note === key) !== undefined
      ? noteValues[note]
      : noteValues.C;
  logDebug(`${note} ${octave} => ${m}`);
  return Math.pow(2, (m + -69) / 12 + (octave - 4)) * 440;
} // tslint:enable:no-magic-numbers

export function beatStringToDur(beatString: string) {
  const beat: string = beatString.substr(0, 1);
  const dots: number = beatString.length - 1;
  return Object.keys(beatValues).find(key => beat === key) !== undefined
    ? beatValues[beat] * (2 - 1 / Math.pow(2, dots))
    : 0;
}

export class Note {
  constructor(
    public readonly note: string,
    public readonly octave: number,
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
  private readonly ac: AudioContext = new AudioContext();
  private readonly ons: OscillatorNode[] = [];
  private readonly dn: WaveShaperNode = this.ac.createWaveShaper();
  private readonly gn: GainNode = this.ac.createGain();
  private readonly ad: AudioDestinationNode = this.ac.destination;

  constructor(
    private readonly numNotes = 6,
    private readonly oscType: OscillatorType = 'sawtooth'
  ) {
    for (let i = 0; i < numNotes; i++) {
      this.ons[i] = this.ac.createOscillator();
      this.ons[i].type = this.oscType;
      this.ons[i].connect(this.dn);
      this.ons[i].start();
    }
    this.dn.connect(this.gn);
  }

  public setFreqs(notes: Note[]): void {
    // Set freq of given notes and connect to graph
    for (let i = 0; i < Math.min(notes.length, this.numNotes); i++) {
      this.ons[i].frequency.value = notes[i].freq();
      this.ons[i].connect(this.dn);
    }
    // If any notes left out, set freq to 0 and disconnect from graph
    for (let i = Math.min(notes.length, this.numNotes); i < notes.length; i++) {
      this.ons[i].frequency.value = 0;
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
