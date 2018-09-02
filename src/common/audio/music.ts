import { Note, REST } from './theory';

export class Sheet {
  constructor(
    public readonly tempo: number = 120,
    public readonly registers: { [id: number]: Note[] }
  ) {}

  public numRegisters(): number {
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
            lnote.volume
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

export function shiftOctave(s: Sheet, oshift: number): Sheet {
  const newReg: { [id: number]: Note[] } = {};
  Object.keys(s.registers).forEach((vali, _) => {
    newReg[+vali] = [];
    s.registers[+vali].forEach((c: Note, j) => {
      newReg[+vali][j] = new Note(
        c.note,
        +c.octave + (c.note !== REST ? oshift : 0),
        c.beat,
        c.sPct,
        c.volume
      );
    });
  });

  return new Sheet(s.tempo, newReg);
}
