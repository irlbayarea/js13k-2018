// import { logDebug } from '../logger';
import { state } from '../../index';
import { Instrument, Note, str2Note } from './music';

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
        str2Note('D|3|h'),
        str2Note('F#|4|h'),
        str2Note('A|4|h'),
      ]);
    } else if (state.input.isPressed('2')) {
      this.instrument.setFreqs([
        new Note('A', 3, 'h'),
        new Note('C#', 4, 'h'),
        new Note('E', 4, 'h'),
      ]);
    } else if (state.input.isPressed('3')) {
      this.instrument.setFreqs([
        new Note('B', 3, 'h'),
        new Note('D', 4, 'h'),
        new Note('F#', 4, 'h'),
      ]);
    } else if (state.input.isPressed('4')) {
      this.instrument.setFreqs([
        new Note('F#', 3, 'h'),
        new Note('A', 3, 'h'),
        new Note('C#', 2, 'h'),
      ]);
    } else if (state.input.isPressed('5')) {
      this.instrument.setFreqs([
        new Note('G', 3, 'h'),
        new Note('B', 3, 'h'),
        new Note('D', 3, 'h'),
      ]);
    } else if (state.input.isPressed('6')) {
      this.instrument.setFreqs([
        new Note('D', 3, 'h'),
        new Note('F#', 3, 'h'),
        new Note('A', 2, 'h'),
      ]);
    } else if (state.input.isPressed('7')) {
      this.instrument.setFreqs([
        new Note('G', 3, 'h'),
        new Note('B', 3, 'h'),
        new Note('D', 3, 'h'),
      ]);
    } else if (state.input.isPressed('8')) {
      this.instrument.setFreqs([
        new Note('A', 3, 'h'),
        new Note('C#', 4, 'h'),
        new Note('E', 3, 'h'),
      ]);
    }
    // tslint:enable:no-magic-numbers
  }
}
