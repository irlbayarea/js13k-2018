export const REST: string = '-';
export const DOT: string = 'd';
export const TRIPLET: string = 'T';
export const SHARP: string = '#';
export const FLAT: string = 'b';
export const SEC_PER_MIN: number = 60;
export const BEATS_PER_MEASURE: number = 4;
export const A440: number = 440;

// tslint:disable:no-magic-numbers
const NOTE_VALS: { [note: string]: number } = {
  A: 69,
  B: 71,
  C: 60,
  D: 62,
  E: 64,
  F: 65,
  G: 67,
}; // tslint:enable:no-magic-numbers

// tslint:disable:no-magic-numbers
const BEAT_VALS: { [beat: string]: number } = {
  e: Math.pow(2, -3), // Eighth
  h: Math.pow(2, -1), // Half
  q: Math.pow(2, -2), // Quarter
  s: Math.pow(2, -4), // Sixteenth
  t: Math.pow(2, -5), // Thirty-second
  w: Math.pow(2, +0), // Whole
}; // tslint:enable:no-magic-numbers

// tslint:disable:no-magic-numbers
/*
* Frequency (Hz) of indicated note and octave
*
* Note can be letter plus sharp(#) or flat(b) symbol
*/
export function note2freq(n: string = REST, o: number = 0): number {
  if (n === REST) {
    return 0;
  } else {
    const b: string = n.substr(0, 1);
    let m: number =
      Object.keys(NOTE_VALS).find(key => b === key) !== undefined
        ? NOTE_VALS[b]
        : NOTE_VALS.C;
    if (n.length > 1) {
      if (n.substr(1, 1) === SHARP) {
        m += 1;
      } else if (n.substr(1, 1) === FLAT) {
        m -= 1;
      }
    }
    return Math.pow(2, (m - NOTE_VALS.A) / 12 + (o - 4)) * A440;
  }
} // tslint:enable:no-magic-numbers

/*
* Number of whole notes represented by "beatString"
* 
* Example: 'qdd' reqpresents a double-dotted quarter note,
*           and would return 1/4 + (1/4)(1/2) + (1/4)(1/2)(1/2) = 7/16
*/
export function str2beat(bstr: string) {
  // First character is the base beat value
  const b: string = bstr.substr(0, 1);
  let trip = false; // is a triplet note?

  // Count the number of DOT characters
  let d: number = 0;
  bstr.split('').forEach((c, _) => {
    trip = trip || c === TRIPLET;
    d += c === DOT ? 1 : 0;
  });

  // Calculate total length of beat
  return Object.keys(BEAT_VALS).find(key => b === key) !== undefined
    ? BEAT_VALS[b] * (2 - 1 / Math.pow(2, d)) * (trip ? 2 / (2 + 1) : 1)
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
    public readonly beat: string = 'q',
    public readonly sPct: number = 0.001, // "staccato percet"
    public readonly vol: number = 1
  ) {}

  public freq(): number {
    return note2freq(this.note.trim(), this.octave);
  }

  public beats(): number {
    return str2beat(this.beat.trim());
  }

  public duration(tempo: number) {
    return (SEC_PER_MIN / tempo) * this.beats() * BEATS_PER_MEASURE;
  }
}
