// tslint:disable:no-magic-numbers
export function noteToFreq(note: string, octave: number): number {
  let m: number;

  // logDebug(`note value is ${note} ${octave}`);

  switch (note) {
    case 'Cb': {
      m = 59;
      break;
    }
    case 'C': {
      m = 60;
      break;
    } // C4
    case 'C#': {
      m = 61;
      break;
    }
    case 'Db': {
      m = 61;
      break;
    }
    case 'D': {
      m = 62;
      break;
    } // D4
    case 'D#': {
      m = 63;
      break;
    }
    case 'Eb': {
      m = 63;
      break;
    }
    case 'E': {
      m = 64;
      break;
    } // E4
    case 'E#': {
      m = 65;
      break;
    }
    case 'Fb': {
      m = 64;
      break;
    }
    case 'F': {
      m = 65;
      break;
    } // F4
    case 'F#': {
      m = 66;
      break;
    }
    case 'Gb': {
      m = 66;
      break;
    }
    case 'G': {
      m = 67;
      break;
    } // G4
    case 'G#': {
      m = 68;
      break;
    }
    case 'Ab': {
      m = 68;
      break;
    }
    case 'A': {
      m = 69;
      break;
    } // A4
    case 'A#': {
      m = 70;
      break;
    }
    case 'Bb': {
      m = 70;
      break;
    }
    case 'B': {
      m = 71;
      break;
    } // B4
    case 'B#': {
      m = 72;
      break;
    }
    default: {
      m = 69;
      break;
    } // A4
  }

  // logDebug(`m value is ${m}`);

  return Math.pow(2, (m + -69) / 12 + (octave - 4)) * 440;
} // tslint:enable:no-magic-numbers

// tslint:disable:no-magic-numbers
export function beatStringToDur(beat: string) {
  switch (beat) {
    case 'w': {
      return 1;
    }
    case 'h': {
      return 1 / 2;
    }
    case 'q': {
      return 1 / 4;
    }
    case 'e': {
      return 1 / 8;
    }
    case 's': {
      return 1 / 16;
    }
    case 't': {
      return 1 / 32;
    }
    default: {
      return 0;
    }
  }
} // tslint:enable:no-magic-numbers

export function beatsToDur(beats: string): number {
  // d = dot
  let dur: number = 0;
  let prevNote: string = '';
  let prevDots: number = 0;
  beats.split('').forEach(char => {
    switch (char) {
      case 'd': {
        dur += beatStringToDur(prevNote) / Math.pow(2, prevDots + 1);
        prevDots += 1;
        prevNote = char;
      }
      default: {
        prevNote = char;
        prevDots = 0;
        dur += beatStringToDur(prevNote);
      }
    }
  });

  return dur;
}

export class Note {
  public readonly freq: number = 0.0;

  constructor(note: string, octv: number, public readonly beats: number = 1.0) {
    this.freq = noteToFreq(note, octv);
  }
}

export class Sound {}
