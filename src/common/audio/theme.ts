import { state } from './../../index';
import { Instrument } from './game-sound';
import { Sheet, shift, str2Sheet } from './music';

const ms2s = 1000; // Milliseconds to Seconds

export const audioContext: AudioContext = new AudioContext();

// Holds information necessary to direct a song
export class Conductor {
  constructor(
    public readonly ins: Instrument[],
    public readonly shts: Sheet[],
    public readonly parts: { [insID: number]: number[] },
    public startTime: number = 0,
    public isPlaying: boolean = false,
    public loops: boolean = true
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
}

const str001: string = `0: B ,4,e | D ,5,e | A ,5,e | G#,5,e | E ,5,e | F#,5,e | D ,5,e | F#,5,e`;
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

const ins0: Instrument = new Instrument('square', sht001.nreg());
const ins1: Instrument = new Instrument('sawtooth', sht10.nreg());
const ins2: Instrument = new Instrument('square', sht10.nreg());

// tslint:disable:no-magic-numbers
const themeSong: Conductor = new Conductor(
  [ins0, ins1, ins2],
  [
    // Sheet , volume set , octave shift , staccato set, note shift
    shift(sht001, 0.125, +0, 0.5), // 0 - LEAD A
    shift(sht001, 0.125, +0, 0.5, -2), // 1 - LEAD B
    shift(sht001, 0.125, -1, 0.5), // 2 - LEAD A
    shift(sht001, 0.125, -1, 0.5, -2), // 3 - LEAD B

    shift(sht10, 0.0675, +0, 0.1), //  4- RHYTHM
    shift(sht11, 0.0675, +1, 0.1), //  5- RHYTHM
    shift(sht10, 0.0675, +1, 0.1), //  6- RHYTHM
  ],
  {
    0: [0, 0, 1, 1, 2, 2, 3, 3, 0, 0, 1, 1, 2, 2, 3, 3],
    1: [4, 5, 5, 4],
    2: [6, 4, 4, 5],
  }
); // tslint:enable:no-magic-numbers

export function playMusic(time: number): void {
  if (state.input.isPressed('M') || themeSong.loops) {
    play(themeSong, time);
  }
}

function play(music: Conductor, time: number) {
  if (!music.isPlaying) {
    music.isPlaying = true;
    music.startTime = time;

    // Relative start time for each successive Sheet
    let st: number = 0;

    // For each GameSound...
    Object.keys(music.parts).forEach((insID: string) => {
      let pid: number;
      // For each Sheet to be played by this GameSound...
      music.parts[+insID].forEach((shtID: number, i: number) => {
        // If first sheet, assume that starts right away
        if (i === 0) {
          st = 0;
          // For successive sheets, start after previous sheet finished
        } else {
          st += music.shts[pid].duration();
        }
        pid = shtID;

        music.ins[+insID].playSheet(
          music.shts[+shtID],
          st,
          music.startTime / ms2s
        );
      });
    });

    music.ins.forEach((ini: Instrument, _) => {
      ini.play();
    });
  } else if (music.loops && time >= music.startTime + music.dur() * ms2s) {
    music.startTime = time;
    music.isPlaying = false;
    play(music, time);
  }
}
