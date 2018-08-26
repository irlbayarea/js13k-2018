import { state } from '../../index';
import { logDebug } from '../logger';
import { Sequence } from './TinyMusic';

export class MusicPlayer {
  private ac: AudioContext = new AudioContext();
  private tempo: number = 128;
  // private sequences: { [id: string]: Sequence } = {};

  // tslint:disable:no-magic-numbers
  constructor() {
    // set the playback tempo (120 beats per minute)
    this.tempo = 120;

    // create a new sequence
    const sequence = new Sequence(this.ac, this.tempo, [
      'G3 q',
      'E4 q',
      'C4 h',
    ]);

    // disable looping
    // sequence.loop = false;

    // play it
    sequence.play(this.ac.currentTime);

    logDebug('Just made MusicPlayer');
  } // tslint:enable:no-magic-numbers

  public update(): void {
    // TODO: Make music start/stop playing upon pressing "M"?
    if (state.input.isPressed('M')) {
      logDebug('Pressing M');
    } else if (state.input.isPressed('N')) {
      logDebug('Pressing N');
    }
  }
}
