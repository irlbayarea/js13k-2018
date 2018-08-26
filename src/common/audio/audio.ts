import { state } from '../../index';
// import { logDebug } from '../logger';
import { Instrument, Note } from './song';
// import { logDebug } from '../logger';

export class AudioHandler {
  private musicIsOn: boolean = false;
  private instrument: Instrument = new Instrument(new AudioContext(), 2 + 1);

  // tslint:disable:no-magic-numbers
  // constructor() {} // tslint:enable:no-magic-numbers

  public update(): void {
    if (state.input.isPressed('M')) {
      if (!this.musicIsOn) {
        this.musicIsOn = true;
        this.instrument.play();
        // tslint:disable-next-line:no-magic-numbers
      }
    } else if (!state.input.isPressed('M')) {
      if (this.musicIsOn) {
        this.musicIsOn = false;
        this.instrument.stop();
      }
    }

    // tslint:disable:no-magic-numbers
    if (state.input.isPressed('1')) {
      this.instrument.setFreqs([
        new Note('D', 4),
        new Note('F#', 4),
        new Note('A', 4),
      ]);
    } else if (state.input.isPressed('2')) {
      this.instrument.setFreqs([
        new Note('A', 4),
        new Note('C#', 3),
        new Note('E', 4),
      ]);
    } else if (state.input.isPressed('3')) {
      this.instrument.setFreqs([
        new Note('B', 4),
        new Note('D', 4),
        new Note('F#', 4),
      ]);
    } else if (state.input.isPressed('4')) {
      this.instrument.setFreqs([
        new Note('F#', 3),
        new Note('A', 3),
        new Note('C#', 3),
      ]);
    } else if (state.input.isPressed('5')) {
      this.instrument.setFreqs([
        new Note('G', 4),
        new Note('B', 4),
        new Note('D', 4),
      ]);
    } else if (state.input.isPressed('6')) {
      this.instrument.setFreqs([
        new Note('D', 3),
        new Note('F#', 3),
        new Note('A', 3),
      ]);
    } else if (state.input.isPressed('7')) {
      this.instrument.setFreqs([
        new Note('G', 4),
        new Note('B', 4),
        new Note('D', 4),
      ]);
    } else if (state.input.isPressed('8')) {
      this.instrument.setFreqs([
        new Note('A', 5),
        new Note('C#', 4),
        new Note('E', 5),
      ]);
    }
    // tslint:enable:no-magic-numbers
  }
}
