/*
* Must be evaluated before Note / Sequence can be used properly
*/

const enharmonics: string =
  'B#-C|C#-Db|D|D#-Eb|E-Fb|E#-F|F#-Gb|G|G#-Ab|A|A#-Bb|B-Cb';
// tslint:disable:no-magic-numbers
const middleC: number = 440 * Math.pow(Math.pow(2, 1 / 12), -9);
const numeric: RegExp = /^[0-9.]+$/;
const octaveOffset: number = 4;
const space: RegExp = /\s+/;
const num: RegExp = /(\d+)/;
const offsets: { [id: string]: number } = {};

// populate the offset lookup (note distance from C, in semitones)
enharmonics.split('|').forEach((val, i) => {
  val.split('-').forEach(note => {
    offsets[note] = i;
  });
});

/*
* Note Class
*/

export class Note {
  // convert a note name (e.g. 'A4') to a frequency (e.g. 440.00)
  public static getFrequency(name: string) {
    const couple = name.split(num);
    const distance = offsets[couple[0]];
    const octaveDiff = (+couple[1] || octaveOffset) - octaveOffset;
    const freq = middleC * Math.pow(Math.pow(2, 1 / 12), distance);
    return freq * Math.pow(2, octaveDiff);
  }

  // convert a duration string (e.g. 'q') to a number (e.g. 1)
  // also accepts numeric strings (e.g '0.125')
  // and compound durations (e.g. 'es' for dotted-eight or eighth plus sixteenth)
  public static getDuration(symbol: string): number {
    return numeric.test(symbol)
      ? +symbol
      : symbol
          .toLowerCase()
          .split('')
          .reduce((prev, curr) => {
            return (
              prev +
              (curr === 'w'
                ? 4
                : curr === 'h'
                  ? 2
                  : curr === 'q'
                    ? 1
                    : curr === 'e'
                      ? 0.5
                      : curr === 's'
                        ? 0.25
                        : 0)
            );
          }, 0);
  }
  public frequency: number = middleC;
  public duration: number = 0;

  constructor(str: string) {
    const couple = str.split(space);

    // frequency, in Hz
    this.frequency = Note.getFrequency(couple[0]) || middleC;

    // duration, as a ratio of 1 beat (quarter note = 1, half note = 0.5, etc.)
    this.duration = Note.getDuration(couple[1]) || 0;
  }
}

/*
* Sequence class
*/

export class Sequence {
  public ac: AudioContext = new AudioContext();

  public bass: BiquadFilterNode = this.ac.createBiquadFilter();
  public mid: BiquadFilterNode = this.ac.createBiquadFilter();
  public treble: BiquadFilterNode = this.ac.createBiquadFilter();

  public gain: GainNode = this.ac.createGain();
  public wet: GainNode = this.ac.createGain();
  public dry: GainNode = this.ac.createGain();

  public osc: OscillatorNode = this.ac.createOscillator();
  public waveType: OscillatorType = 'square';

  public tempo: number = 120;
  public loop: boolean = true;
  public smoothing: number = 0;
  public staccato: number = 0;
  public notes: Note[] = [];

  // private playedAtLeastOnce: boolean = false;

  constructor(ac: AudioContext, tempo: number, noteStrings: string[]) {
    this.ac = ac;

    this.gain = this.ac.createGain();

    this.bass = this.ac.createBiquadFilter();
    this.bass.type = 'peaking';
    this.bass.frequency.value = 100;
    this.gain.connect(this.bass);

    this.mid = this.ac.createBiquadFilter();
    this.mid.type = 'peaking';
    this.mid.frequency.value = 1000;
    this.bass.connect(this.mid);

    this.treble = this.ac.createBiquadFilter();
    this.treble.type = 'peaking';
    this.treble.frequency.value = 2500;
    this.mid.connect(this.treble);

    this.treble.connect((this.wet = this.ac.createGain()));
    this.treble.connect((this.dry = this.ac.createGain()));

    this.tempo = tempo;

    noteStrings.forEach(note => {
      this.notes.push(new Note(note));
    });
  }

  // schedules this.notes[ index ] to play at the given time
  // returns an AudioContext timestamp of when the note will *end*

  public scheduleNote(index: number, when: number): number {
    const duration = (60 / this.tempo) * this.notes[index].duration;
    const cutoff = duration * (1 - (this.staccato || 0.00000000001));

    this.setFrequency(this.notes[index].frequency, when);

    if (this.smoothing && this.notes[index].frequency) {
      this.slide(index, when, cutoff);
    }

    this.setFrequency(0, when + cutoff);

    return when + duration;
  }

  // get the next note
  public getNextNote(index: number) {
    return this.notes[index < this.notes.length - 1 ? index + 1 : 0];
  }

  // how long do we wait before beginning the slide? (in seconds)
  public getSlideStartDelay(duration: number) {
    return duration - Math.min(duration, (60 / this.tempo) * this.smoothing);
  }

  // slide the note at <index> into the next note at the given time,
  // and apply staccato effect if needed
  public slide(index: number, when: number, cutoff: number) {
    const next = this.getNextNote(index);
    const start = this.getSlideStartDelay(cutoff);
    this.setFrequency(this.notes[index].frequency, when + start);
    this.rampFrequency(next.frequency, when + cutoff);
  }

  // set frequency at time
  public setFrequency(freq: number, when: number) {
    this.osc.frequency.setValueAtTime(freq, when);
  }

  // ramp to frequency at time
  public rampFrequency(freq: number, when: number) {
    this.osc.frequency.linearRampToValueAtTime(freq, when);
  }

  // run through all notes in the sequence and schedule them
  public play(when: number = this.ac.currentTime) {
    this.createOscillator();
    this.osc.start(when);

    this.notes.forEach((_, i) => {
      this.scheduleNote(i, when);
    });

    this.osc.stop(when);
    this.osc.onended = this.loop ? this.play(when) : null;

    return null;
  }

  // stop playback, null out the oscillator, cancel parameter automation
  public stop() {
    if (this.osc) {
      this.osc.onended = null;
      this.osc.stop(0);
      this.osc.frequency.cancelScheduledValues(0);
      // this.osc = null;
    }
  }

  // recreate the oscillator node (happens on every play)
  private createOscillator(): void {
    this.stop();
    this.osc = this.ac.createOscillator();
    this.osc.type = this.waveType || 'square';
    this.osc.connect(this.gain);
  }
}
