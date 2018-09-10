import { BEATS_PER_MEASURE, Note, REST, SEC_PER_MIN } from './theory';

export class Sheet {
  constructor(
    public readonly tempo: number = 120,
    public readonly registers: { [id: number]: Note[] },
    private readonly gainC: number = 2 ** -12, // tslint:disable-line:no-magic-numbers
    private readonly freqC: number = 2 ** -12 // tslint:disable-line:no-magic-numbers
  ) {}

  public nreg(): number {
    return Object.keys(this.registers).length;
  }

  public duration(): number {
    let dur: number = 0;
    let maxdur: number = 0;
    Object.keys(this.registers).forEach((val: string, _) => {
      this.registers[+val].forEach((c: Note, i: number) => {
        if (i === 0) {
          dur = c.duration(this.tempo);
        } else {
          dur += c.duration(this.tempo);
          if (i === this.registers[+val].length - 1) {
            if (dur > maxdur) {
              maxdur = dur;
            }
          }
        }
      });
    });
    return maxdur;
  }

  public gainConst(): number {
    // tslint:disable-next-line:no-magic-numbers
    return (SEC_PER_MIN / this.tempo) * this.gainC * BEATS_PER_MEASURE;
  }

  public freqConst(): number {
    // tslint:disable-next-line:no-magic-numbers
    return (SEC_PER_MIN / this.tempo) * this.freqC * BEATS_PER_MEASURE;
  }
}

// Helper function
export function str2Note(noteString: string): Note {
  return new Note(...noteString.split('|'));
}

/*
* Convert a string into a SheetMusic object
*/
export function str2Sheet(songStr: string, tempo: number = 120): Sheet {
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
        if (lnote.sPct >= 1.0 || lnote.sPct <= 0.0) {
          notes[notes.length - 1] = new Note(
            lnote.note,
            lnote.octave,
            lnote.beat,
            lnote.vol
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

  return new Sheet(tempo, registers);
}

// volume, octave, staccato, note steps
export function shift(
  s: Sheet,
  vset: number = 0,
  oshift: number = 0,
  sset: number = -1,
  nshift: number = 0
): Sheet {
  const newReg: { [id: number]: Note[] } = {};
  Object.keys(s.registers).forEach((vali, _) => {
    newReg[+vali] = [];
    s.registers[+vali].forEach((c: Note, j) => {
      newReg[+vali][j] = new Note(
        c.note,
        +c.octave + (c.note !== REST ? oshift : 0),
        c.beat,
        sset < 0 ? c.sPct : sset,
        c.note !== REST ? vset : 0,
        c.shift + nshift
      );
    });
  });

  return new Sheet(s.tempo, newReg);
}
