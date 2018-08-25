import { state } from '../../index';
import { logDebug } from '../logger';
import { createReverb, Sequence } from './TinyMusic';
export class MusicPlayer {
  private ac: AudioContext = new AudioContext();
  private tempo: number = 128;
  private volume: number = 0.5;
  private muted: boolean = true;
  private sequences: { [id: string]: Sequence } = {};
  private output: GainNode;

  // tslint:disable:no-magic-numbers
  constructor() {
    const osc = this.ac.createOscillator();
    const compressor = this.ac.createDynamicsCompressor();
    this.output = this.ac.createGain();
    this.output.connect(this.ac.destination);
    this.output.gain.value = this.volume;

    const reverb = this.ac.createConvolver();
    reverb.buffer = createReverb(this.ac, 2, 2);
    reverb.connect(compressor);

    this.sequences.collision1 = new Sequence(this.ac, 220, [
      'G3 s',
      'D4 s',
      'G4 s',
    ]);
    this.sequences.collision2 = new Sequence(this.ac, 220, [
      'G4 s',
      'D4 s',
      'G3 s',
    ]);

    this.sequences.collision1.dry.connect(this.output);
    this.sequences.collision1.gain.gain.value = 0.4;
    this.sequences.collision1.loop = false;

    this.sequences.collision2.dry.connect(this.output);
    this.sequences.collision2.gain.gain.value = 0.4;
    this.sequences.collision2.loop = false;

    osc.frequency.value = 0;
    osc.connect(compressor);
    osc.start();

    this.sequences.bass = new Sequence(this.ac, this.tempo, [
      'C2  e',
      'C2  e',
      'C2  e',
      'C2  e',
      'C2  e',
      'C2  e',
      'C2  e',
      'G2  e',

      'G2  e',
      'G2  e',
      'G2  e',
      'G2  e',
      'G2  e',
      'G2  e',
      'G2  e',
      'E2  e',

      'E2  e',
      'E2  e',
      'E2  e',
      'E2  e',
      'E2  e',
      'E2  e',
      'E2  e',
      'G2  e',

      'G2  e',
      'G2  e',
      'G2  e',
      'D2  e',
      'D2  e',
      'D2  e',
      'D2  e',
      'C2  e',
    ]);

    this.sequences.lead = new Sequence(this.ac, this.tempo, [
      '_  e',
      'G4 e',
      'G5 e',
      'G4 e',
      'D5 e',
      'C5 e',
      'B4 e',
      'C5 e',

      '_  e',
      'G4 e',
      'D5 e',
      'E5 e',
      'D5 e',
      'C5 e',
      'B4 e',
      'A4 e',

      '_  e',
      'G4 e',
      'G5 e',
      'G4 e',
      'D5 e',
      'C5 e',
      'B4 e',
      'C5 e',

      '_  e',
      'G4 e',
      'D5 e',
      'E5 e',
      'D5 e',
      'B4 e',
      'A4 e',
      'G4 e',
    ]);

    this.sequences.counterpoint = new Sequence(this.ac, this.tempo, [
      'E4 3',
      'F#4 e',
      'D4 3.5',
      'B3 e',
      'G4 3.5',
      'E4 e',
      'B4 h',
      'A4 q',
      'G4  e',
      'F#4 e',
      'E4 e',
    ]);

    this.sequences.kick = new Sequence(this.ac, this.tempo, [
      'G2 0.01',
      'C2 0.19',
      '-  0.80',
    ]);

    this.sequences.pad1 = new Sequence(this.ac, this.tempo, [
      'G3 3.5',
      'G3 4',
      'G3 4',
      'G3 4',
      'G3 0.5',
    ]);

    this.sequences.pad2 = new Sequence(this.ac, this.tempo, [
      'C4 3.5',
      'B3 4',
      'E4 4',
      'B3 2',
      'D4 2',
      'C4 0.5',
    ]);

    this.sequences.kick.wet.connect(reverb);
    this.sequences.bass.wet.connect(reverb);
    this.sequences.lead.wet.connect(reverb);
    this.sequences.counterpoint.wet.connect(reverb);
    this.sequences.pad1.wet.connect(reverb);
    this.sequences.pad2.wet.connect(reverb);
    this.sequences.kick.dry.connect(compressor);
    this.sequences.bass.dry.connect(compressor);
    this.sequences.lead.dry.connect(compressor);
    this.sequences.counterpoint.dry.connect(compressor);
    this.sequences.pad1.dry.connect(compressor);
    this.sequences.pad2.dry.connect(compressor);

    compressor.ratio.value = 4;
    compressor.threshold.value = -12;
    compressor.connect(this.output);

    this.sequences.bass.staccato = 0.25;
    this.sequences.bass.waveType = 'sawtooth';
    this.sequences.bass.treble.type = 'lowpass';
    this.sequences.bass.treble.frequency.value = 2500;
    this.sequences.bass.mid.gain.value = -2;

    this.sequences.lead.smoothing = 0.06;
    this.sequences.lead.gain.gain.value = 0.35;
    this.sequences.lead.wet.gain.value = 1.5;

    this.sequences.counterpoint.smoothing = 0.06;
    this.sequences.counterpoint.gain.gain.value = 0.22;

    this.sequences.pad1.gain.gain.value = 0.25;
    this.sequences.pad1.wet.gain.value = 3;
    this.sequences.pad1.waveType = 'sawtooth';

    this.sequences.pad2.gain.gain.value = 0.2;
    this.sequences.pad2.wet.gain.value = 3;
    this.sequences.pad2.waveType = 'sawtooth';

    this.sequences.kick.waveType = 'sine';
    this.sequences.kick.smoothing = 0.8;
    this.sequences.kick.gain.gain.value = 2.0;
    this.sequences.kick.bass.frequency.value = 60;
    this.sequences.kick.bass.gain.value = 10;
    this.sequences.kick.mid.frequency.value = 100;
    this.sequences.kick.mid.gain.value = 5;
    this.sequences.kick.wet.gain.value = 0.3;
  } // tslint:enable:no-magic-numbers

  public update(): void {
    // TODO: Make music start/stop playing upon pressing "M"?
    if (state.input.isPressed('M')) {
      logDebug('Pressing M');
    } else if (state.input.isPressed('N')) {
      logDebug('Pressing N');
    }
  }

  public startMusic(): void {
    this.play();
  }

  // tslint:disable:no-magic-numbers
  public play(): void {
    const now = this.ac.currentTime;
    const delay = now + (60 / this.tempo) * 16;
    this.sequences.lead.play(now);
    this.sequences.counterpoint.play(delay);
    this.sequences.bass.play(delay);
    this.sequences.kick.play(delay);
    this.sequences.pad1.play(delay);
    this.sequences.pad2.play(delay);
  } // tslint:enable:no-magic-numbers

  public stop() {
    this.sequences.lead.stop();
    this.sequences.counterpoint.stop();
    this.sequences.bass.stop();
    this.sequences.kick.stop();
    this.sequences.pad1.stop();
    this.sequences.pad2.stop();
  }

  public mute() {
    if (this.muted) {
      this.muted = false;
      this.output.gain.value = this.volume;
    } else {
      this.muted = true;
      this.output.gain.value = 0;
    }
  }

  public collide(descend: boolean) {
    this.sequences.collision1.stop();
    this.sequences.collision2.stop();
    if (descend) {
      this.sequences.collision2.play(this.ac.currentTime);
    } else {
      this.sequences.collision1.play(this.ac.currentTime);
    }
  }
}
