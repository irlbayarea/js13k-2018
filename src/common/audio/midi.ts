import { state } from '../../index';
// import { logDebug } from '../logger';

export class MusicPlayer {
  private ac: AudioContext = new AudioContext();
  private on: OscillatorNode = this.ac.createOscillator();
  private an: AnalyserNode = this.ac.createAnalyser();
  // private cn: ConvolverNode = this.ac.createConvolver();
  private dn: WaveShaperNode = this.ac.createWaveShaper();
  private gn: GainNode = this.ac.createGain();
  private ad: AudioDestinationNode = this.ac.destination;
  private musicIsOn: boolean = false;

  // tslint:disable:no-magic-numbers
  constructor() {
    this.on.type = 'sine';
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
    // TODO: Make music start/stop playing upon pressing "M"?
    if (state.input.isPressed('M')) {
      if (!this.musicIsOn) {
        this.musicIsOn = true;
        this.gn.connect(this.ad);
      }
    } else if (!state.input.isPressed('M')) {
      if (this.musicIsOn) {
        this.musicIsOn = false;
        this.gn.disconnect(this.ad);
      }
    }
  }
}
