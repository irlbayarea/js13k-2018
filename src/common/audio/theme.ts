import { state } from './../../index';
import { audioContext } from './audio';
import { Sheet, shift, str2Sheet } from './music';
import { GameSound } from './sound-effects';
import { MILLISEC_TO_SEC } from './theory';

export const musicStartKey = 'M';
export const musicStopKey = 'N';

// Holds information necessary to direct a song
export class Conductor {
  constructor(
    public readonly ins: { [gsID: number]: GameSound },
    public readonly shts: { [shtID: number]: Sheet },
    public readonly parts: { [gsID: number]: number[] },
    public loops: boolean = true,
    public startTime: number = 0,
    public isPlaying: boolean = false
  ) {}

  public dur(): number {
    let maxdur = 0;
    Object.keys(this.parts).forEach((insID, _) => {
      let dur = 0;
      this.parts[+insID].forEach((sID: number) => {
        dur += this.shts[sID].duration();
      });
      maxdur = dur > maxdur ? dur : maxdur;
    });

    return maxdur;
  }
  public play(time: number) {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.startTime = time;

      // Relative start time for each successive Sheet
      let st: number = 0;

      // For each GameSound...
      Object.keys(this.parts).forEach((insID: string) => {
        let pid: number;
        // For each Sheet to be played by this GameSound...
        this.parts[+insID].forEach((shtID: number, i: number) => {
          // If first sheet, assume that starts right away
          if (i === 0) {
            st = 0;
            // For successive sheets, start after previous sheet finished
          } else {
            st += this.shts[pid].duration();
          }
          pid = shtID;

          this.ins[+insID].playSheet(
            this.shts[+shtID],
            st,
            this.startTime / MILLISEC_TO_SEC
          );
        });
      });

      Object.keys(this.ins).forEach((ini: string, _) => {
        this.ins[+ini].play();
      });
    }

    if (time >= this.startTime + this.dur() * MILLISEC_TO_SEC) {
      this.isPlaying = false;
      if (this.loops) {
        this.startTime = time;
        this.play(time);
      }
    }
  }

  public stop(t0: number) {
    if (this.isPlaying) {
      this.isPlaying = false;
      Object.keys(this.ins).forEach((ini: string, _) => {
        this.ins[+ini].stop(t0);
      });
    }
  }
}

const str001: string = `0: B ,4,e | D ,5,e | A ,5,e | G#,5,e | E ,5,e | F#,5,e | D ,5,e | F#,5,e`;
const str002: string = `
0: B ,4,e | D ,5,e | A ,5,e | G#,5,e | E ,5,e | F#,5,e | D ,5,e | F#,5,e
1: B ,3,e | D ,4,e | A ,4,e | G#,4,e | E ,4,e | F#,4,e | D ,4,e | F#,4,e
`;
const str10: string = `
0: A ,3,qd| B ,3,qd| E ,3,q | A ,3,qd| B ,3,qd| E ,3,q
0: G ,3,qd| A ,3,qd| E ,3,q | G ,3,qd| A ,3,qd| A ,3,e | B ,3, e
`;
const str11: string = `
0: A ,3,q | A ,3,e | B ,3,q | B ,3,e |E ,3,q | A ,3,q | A ,3,e | B ,3,q | B ,3,e |E ,3,q
0: G ,3,q | G ,3,e | A ,3,q | A ,3,e |E ,3,q | G ,3,q | G ,3,e | A ,3,q | A ,3,e |A ,3,e | B ,3, e
`;

const tempo: number = 140;

const sht001: Sheet = str2Sheet(str001, tempo);
const sht10: Sheet = str2Sheet(str10, tempo);
const sht11: Sheet = str2Sheet(str11, tempo);

const sht002: Sheet = str2Sheet(str002, tempo);

// tslint:disable:no-magic-numbers
const ins0: GameSound = new GameSound(
  +sht002.nreg(),
  ['square', 'triangle'],
  [0.001, 0.95],
  [0.001, 0.95]
);
const ins1: GameSound = new GameSound(
  +sht10.nreg(),
  ['sawtooth'],
  [0.001],
  [0.001]
);
const ins2: GameSound = new GameSound(
  +sht10.nreg(),
  ['square'],
  [0.001],
  [0.001]
); // tslint:enable:no-magic-numbers

// tslint:disable:no-magic-numbers
const themeSong: Conductor = new Conductor(
  { 0: ins0, 1: ins1, 2: ins2 },
  {
    // Sheet , volume set , octave shift , staccato set, note shift
    0: shift(sht001, 0.125, +0, 0.5, +0), // LEAD A
    1: shift(sht001, 0.125, +0, 0.5, -2), // LEAD B

    2: shift(sht001, 0.125, -1, 0.5, +0), // LEAD A
    3: shift(sht001, 0.125, -1, 0.5, -2), // LEAD B

    4: shift(sht10, 0.0675, +0, 0.1, +0), // RHYTHM
    5: shift(sht11, 0.0675, +1, 0.1, +0), // RHYTHM
    6: shift(sht10, 0.0675, +1, 0.1, +0), // RHYTHM

    7: shift(sht002, 0.125, +1, 0.5, +0), // LEAD A2
    8: shift(sht002, 0.125, +1, 0.5, -2), // LEAD B2
  },
  {
    0: [7, 7, 8, 8], // , 2, 2, 3, 3, 7, 7, 1, 1, 2, 2, 3, 3],
    1: [4], // , 5, 5, 4],
    2: [6], // , 4, 4, 5],
  },
  true // loops
); // tslint:enable:no-magic-numbers

export function playMusic(t0: number): void {
  if (
    (themeSong.isPlaying && themeSong.loops) ||
    state.input.isPressed(musicStartKey)
  ) {
    themeSong.play(t0);
  } else if (state.input.isPressed(musicStopKey)) {
    themeSong.stop(audioContext.currentTime + 0.001); // tslint:disable-line:no-magic-numbers
  }
}
