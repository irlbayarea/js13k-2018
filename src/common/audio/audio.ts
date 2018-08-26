import { state } from '../../index';
import { logDebug } from '../logger';
import { noteToFreq } from './song';
// import { logDebug } from '../logger';

export class AudioHandler {
  private readonly ac: AudioContext = new AudioContext();
  private readonly on: OscillatorNode = this.ac.createOscillator();
  private readonly an: AnalyserNode = this.ac.createAnalyser();
  // private cn: ConvolverNode = this.ac.createConvolver();
  private readonly dn: WaveShaperNode = this.ac.createWaveShaper();
  private readonly gn: GainNode = this.ac.createGain();
  private readonly ad: AudioDestinationNode = this.ac.destination;
  private musicIsOn: boolean = false;

  private note: string = 'A';
  private octv: number = 4;

  // tslint:disable:no-magic-numbers
  constructor() {
    this.on.type = 'sawtooth';
    this.on.frequency.value = 440;
    this.on.start();

    this.on.connect(this.an);

    this.an.minDecibels = -40;
    this.an.maxDecibels = 30;

    this.an.connect(this.dn);
    this.dn.connect(this.gn);

    // this.cn.connect(this.gn);

    this.ad = this.ac.destination;
  } // tslint:enable:no-magic-numbers

  public update(): void {
    if (state.input.isPressed('M')) {
      if (!this.musicIsOn) {
        this.musicIsOn = true;
        // tslint:disable-next-line:no-magic-numbers
        this.gn.connect(this.ad);
      }
    } else if (!state.input.isPressed('M')) {
      if (this.musicIsOn) {
        this.musicIsOn = false;
        this.gn.disconnect(this.ad);
      }
    }

    if (state.input.isPressed('1')) {
      this.note = 'C';
    } else if (state.input.isPressed('2')) {
      this.note = 'C#';
    } else if (state.input.isPressed('3')) {
      this.note = 'D';
    } else if (state.input.isPressed('4')) {
      this.note = 'D#';
    } else if (state.input.isPressed('5')) {
      this.note = 'E';
    } else if (state.input.isPressed('6')) {
      this.note = 'F';
    } else if (state.input.isPressed('7')) {
      this.note = 'F#';
    } else if (state.input.isPressed('8')) {
      this.note = 'G';
    } else if (state.input.isPressed('9')) {
      this.note = 'G#';
    } else if (state.input.isPressed('0')) {
      this.note = 'A';
    } else if (state.input.isPressed('-')) {
      this.note = 'A#';
    } else if (state.input.isPressed('=')) {
      this.note = 'B';
    }

    if (state.input.isPressed('Z')) {
      this.octv = 1;
    } else if (state.input.isPressed('X')) {
      this.octv = 2;
    } else if (state.input.isPressed('C')) {
      this.octv = 2 + 1;
    } else if (state.input.isPressed('V')) {
      this.octv = 2 + 2;
    } else if (state.input.isPressed('B')) {
      this.octv = 2 + 2 + 1;
    } else if (state.input.isPressed('N')) {
      this.octv = 2 + 2 + 2;
    }

    this.on.frequency.value = noteToFreq(this.note, this.octv);

    logDebug(`Note is ${this.note} ${this.octv}`);
  }
}
