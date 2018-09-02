import { GameSound } from './gamesound';
import { Sheet, shift, str2Sheet } from './music';

const ms2s = 1000; // Milliseconds to Seconds

export const audioContext: AudioContext = new AudioContext();
export class SongHandler {
  constructor(
    public readonly ins: GameSound[],
    public readonly shts: Sheet[],
    public readonly parts: { [insID: number]: number[] },
    public startTime: number = 0,
    public isPlaying: boolean = false,
    public loop: boolean = true
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

const str00: string = `
0: B ,4,e | D,5,e | A,5,e | G#,5,e | E ,5,e | F#,5,e | D ,5,e | F#,5,e | B ,4,e | D,5,e | A,5,e | G#,5,e | E ,5,e | F#,5,e | D ,5,e | F#,5,e 
0: A ,4,e | C,5,e | G,5,e | F#,5,e | D ,5,e | E ,5,e | C ,5,e | E ,5,e | A ,4,e | C,5,e | G,5,e | F#,5,e | D ,5,e | E ,5,e | C ,5,e | E ,5,e
`;

const str10: string = `
0: A ,3,qd| B ,3,qd| E ,3,q | A ,3,qd| B ,3,qd| E ,3,q
0: G ,3,qd| A ,3,qd| E ,3,q | G ,3,qd| A ,3,qd| A ,3,e | B ,3, e
`;

const str11: string = `
0: A ,3,q | A ,3,e | B ,3,q | B ,3,e |E ,3,q | A ,3,q | A ,3,e | B ,3,q | B ,3,e |E ,3,q
0: G ,3,q | G ,3,e | A ,3,q | A ,3,e |E ,3,q | G ,3,q | G ,3,e | A ,3,q | A ,3,e |A ,3,e | B ,3, e
`;

const tempo: number = 160;

const sht00: Sheet = str2Sheet(str00, tempo);
const sht10: Sheet = str2Sheet(str10, tempo);
const sht11: Sheet = str2Sheet(str11, tempo);

const ins0: GameSound = new GameSound('sawtooth', sht00.nreg());
const ins1: GameSound = new GameSound('square', sht10.nreg());
const ins2: GameSound = new GameSound('sine', sht10.nreg());

// tslint:disable:no-magic-numbers
export const gameMusic: SongHandler = new SongHandler(
  [ins0, ins1, ins2],
  [
    // Sheet , volume set , octave shift , staccato set
    shift(sht00, 0.5, +0, 0.5), // 0 - LEAD
    shift(sht00, 0.5, -1, 0.7), // 1 - LEAD
    shift(sht10, 0.3, +0, 0.1), // 2 - RHYTHM
    shift(sht11, 0.3, +1, 0.1), // 3 - RHYTHM
    shift(sht10, 0.3, +1, 0.1), // 4 - RHYTHM
  ],
  {
    0: [0, 1, 0, 1],
    1: [2, 3, 3, 4],
    2: [4, 2, 1, 0],
  }
); // tslint:enable:no-magic-numbers

export function play(time: number): void {
  if (!gameMusic.isPlaying) {
    gameMusic.isPlaying = true;
    gameMusic.startTime = time;

    let dt: number = 0;

    Object.keys(gameMusic.parts).forEach((insID: string) => {
      gameMusic.parts[+insID].forEach((shtID: number, i: number) => {
        if (i === 0) {
          dt = 0;
        } else {
          dt += gameMusic.shts[i - 1].duration();
        }
        gameMusic.ins[+insID].playSheet(
          gameMusic.shts[+shtID],
          dt,
          gameMusic.startTime / ms2s
        );
      });
    });

    gameMusic.ins.forEach((ini: GameSound, _) => {
      ini.play();
    });
  } else if (
    gameMusic.loop &&
    time >= gameMusic.startTime + gameMusic.dur() * ms2s
  ) {
    gameMusic.startTime = time;
    gameMusic.isPlaying = false;
    play(time);
  }
}
