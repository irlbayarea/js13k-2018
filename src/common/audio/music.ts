// import { logDebug } from '../logger';

const REST: string = '-';
const DOT: string = 'd';
const TRIPLET: string = 'T';
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
  let tripletType = false;

  // Count the number of DOT characters
  let dots: number = 0;
  beatString.split('').forEach((val, _) => {
    tripletType = tripletType || val === TRIPLET;
    dots += val === DOT ? 1 : 0;
  });

  // Calculate total length of beat
  return Object.keys(beatValues).find(key => beat === key) !== undefined
    ? beatValues[beat] *
        (2 - 1 / Math.pow(2, dots)) *
        (tripletType ? 2 / (2 + 1) : 1)
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
    public readonly beat: string = 'q',
    public readonly staccacoPercent: number = 0.1
  ) {}

  public freq(): number {
    return noteToFreq(this.note.trim(), this.octave);
  }

  public beats(): number {
    return stringToBeats(this.beat.trim());
  }

  public duration(tempo: number) {
    return (SEC_PER_MIN / tempo) * this.beats() * BEATS_PER_MEASURE;
  }
}

export class SheetMusic {
  constructor(
    public readonly tempo: number = 120,
    public readonly registers: { [id: number]: Note[] },
    public readonly volume: number = 0.1
  ) {}

  public numRegisters(): number {
    return Object.keys(this.registers).length;
  }
}

/*
* Convert a string into a SheetMusic object
*/
export function str2SheetMusic(
  songStr: string,
  tempo: number = 120,
  volume: number = 0.1
): SheetMusic {
  // Define registers for SheetMusic
  const registers: { [id: number]: Note[] } = {};

  // Split string up by line
  const lines: string[] = songStr.split('\n');

  // Parse each line
  lines.forEach(line => {
    // Register defined by `n : ...` where "n" is the desired register
    // and the music is defined after the ":" character
    const line2: string[] = line.split(':');

    // If the line is a properly formatted music line...
    if (line2[1] !== undefined) {
      // Line number is everything before the ":"
      const lineNo: number = +line2[0];
      // Notes are split up by ","
      const noteStrs: string[] = line2[1].split('|');
      // Parse each Note string
      const notes: Note[] = [];
      noteStrs.forEach((val: string, _) => {
        notes.push(new Note(...val.split(',')));
        const lnote = notes[notes.length - 1];
        if (lnote.staccacoPercent >= 1.0 || lnote.staccacoPercent <= 0.0) {
          notes[notes.length - 1] = new Note(
            lnote.note,
            lnote.octave,
            lnote.beat,
            0.0
          );
        }
      });
      // Push the Note objects onto the proper register
      if (lineNo !== undefined) {
        if (registers[lineNo] !== undefined) {
          registers[lineNo].push(...notes);
        } else {
          registers[lineNo] = notes;
        }
      }
    }
  });

  return new SheetMusic(tempo, registers, volume);
}
