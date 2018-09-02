import { Instrument } from './instrument';
import { Sheet } from './music';
export const audioContext: AudioContext = new AudioContext();
export class MusicHandler {
  constructor(
    public readonly instruments: Instrument[],
    public readonly sheets: Sheet[],
    public readonly assignments: { [insID: number]: number[] }
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
