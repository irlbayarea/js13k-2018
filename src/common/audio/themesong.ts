import { Instrument } from './instrument';
import { Sheet, shiftOctave, shiftVolume, str2Sheet } from './music';

const MILLISECONDS_PER_SECOND = 1000;

export const audioContext: AudioContext = new AudioContext();
export class SongHandler {
  constructor(
    public readonly instruments: Instrument[],
    public readonly sheets: Sheet[],
    public readonly assignments: { [insID: number]: number[] },
    public startTime: number = 0,
    public playing: boolean = false,
    public loop: boolean = true
  ) {}

  public duration(): number {
    let maxdur = 0;
    Object.keys(this.assignments).forEach((insID, _) => {
      let dur = 0;
      this.assignments[+insID].forEach((sID: number) => {
        dur += this.sheets[sID].duration();
      });
      maxdur = dur > maxdur ? dur : maxdur;
    });

    return maxdur;
  }
}

const mainTheme00: string = `
0: B ,4,e | D,5,e | A,5,e | G#,5,e | E ,5,e | F#,5,e | D ,5,e | F#,5,e | B ,4,e | D,5,e | A,5,e | G#,5,e | E ,5,e | F#,5,e | D ,5,e | F#,5,e 
0: A ,4,e | C,5,e | G,5,e | F#,5,e | D ,5,e | E ,5,e | C ,5,e | E ,5,e | A ,4,e | C,5,e | G,5,e | F#,5,e | D ,5,e | E ,5,e | C ,5,e | E ,5,e
`;

const mainTheme10: string = `
0: A ,3,qd| B ,3,qd| E ,3,q | A ,3,qd| B ,3,qd| E ,3,q
0: G ,3,qd| A ,3,qd| E ,3,q | G ,3,qd| A ,3,qd| A ,3,e | B ,3, e
`;

const mainTheme11: string = `
0: A ,3,q | A ,3,e | B ,3,q | B ,3,e |E ,3,q | A ,3,q | A ,3,e | B ,3,q | B ,3,e |E ,3,q
0: G ,3,q | G ,3,e | A ,3,q | A ,3,e |E ,3,q | G ,3,q | G ,3,e | A ,3,q | A ,3,e |A ,3,e | B ,3, e
`;

const mainThemeTempo: number = 100;

const mainTheme00Sheet: Sheet = str2Sheet(mainTheme00, mainThemeTempo);
const mainTheme10Sheet: Sheet = str2Sheet(mainTheme10, mainThemeTempo);
const mainTheme11Sheet: Sheet = str2Sheet(mainTheme11, mainThemeTempo);

const mainThemeInstrument0: Instrument = new Instrument('sawtooth');
const mainThemeInstrument1: Instrument = new Instrument('square');

// tslint:disable:no-magic-numbers
export const mainTheme: SongHandler = new SongHandler(
  [mainThemeInstrument0, mainThemeInstrument1],
  [
    shiftVolume(shiftOctave(mainTheme00Sheet, +0), -0.5), // 0 - LEAD
    shiftVolume(shiftOctave(mainTheme00Sheet, -1), -0.5), // 1 - LEAD
    shiftVolume(shiftOctave(mainTheme10Sheet, +0), -0.75), // 2 - RHYTHM
    shiftVolume(shiftOctave(mainTheme11Sheet, +1), -0.75), // 3 - RHYTHM
    shiftVolume(shiftOctave(mainTheme10Sheet, +1), -0.75), // 4 - RHYTHM
  ],
  {
    0: [0, 1, 0, 1],
    1: [2, 3, 3, 4],
  }
); // tslint:enable:no-magic-numbers

export function playMusic(currentTime: number): void {
  if (!mainTheme.playing) {
    mainTheme.playing = true;
    mainTheme.startTime = currentTime;

    let dt: number = 0;

    Object.keys(mainTheme.assignments).forEach((insID: string) => {
      mainTheme.assignments[+insID].forEach((shtID: number, i: number) => {
        if (i === 0) {
          dt = 0;
        } else {
          dt += mainTheme.sheets[i - 1].duration();
        }
        mainTheme.instruments[+insID].playSheet(
          mainTheme.sheets[+shtID],
          dt,
          mainTheme.startTime / MILLISECONDS_PER_SECOND
        );
      });
    });

    mainTheme.instruments.forEach((ini: Instrument, _) => {
      ini.play();
    });
  } else if (
    mainTheme.loop &&
    currentTime >=
      mainTheme.startTime + mainTheme.duration() * MILLISECONDS_PER_SECOND
  ) {
    mainTheme.startTime = currentTime;
    mainTheme.playing = false;
    playMusic(currentTime);
  }
}
