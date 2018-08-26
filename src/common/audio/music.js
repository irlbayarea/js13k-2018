(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (
    typeof exports === 'object' &&
    typeof exports.nodeName !== 'string'
  ) {
    factory(exports);
  } else {
    factory((root.TinyMusic = {}));
  }
})(this, function(exports) {
  /*
 * Private stuffz
 */

  var enharmonics = 'B#-C|C#-Db|D|D#-Eb|E-Fb|E#-F|F#-Gb|G|G#-Ab|A|A#-Bb|B-Cb',
    middleC = 440 * Math.pow(Math.pow(2, 1 / 12), -9),
    numeric = /^[0-9.]+$/,
    octaveOffset = 4,
    space = /\s+/,
    num = /(\d+)/,
    offsets = {};

  // populate the offset lookup (note distance from C, in semitones)
  enharmonics.split('|').forEach(function(val, i) {
    val.split('-').forEach(function(note) {
      offsets[note] = i;
    });
  });

  /*
 * Note class
 *
 * new Note ('A4 q') === 440Hz, quarter note
 * new Note ('- e') === 0Hz (basically a rest), eigth note
 * new Note ('A4 es') === 440Hz, dotted eighth note (eighth + sixteenth)
 * new Note ('A4 0.0125') === 440Hz, 32nd note (or any arbitrary
 * divisor/multiple of 1 beat)
 *
 */

  // create a new Note instance from a string
  function Note(str) {
    var couple = str.split(space);
    // frequency, in Hz
    this.frequency = Note.getFrequency(couple[0]) || 0;
    // duration, as a ratio of 1 beat (quarter note = 1, half note = 0.5, etc.)
    this.duration = Note.getDuration(couple[1]) || 0;
  }

  // convert a note name (e.g. 'A4') to a frequency (e.g. 440.00)
  Note.getFrequency = function(name) {
    var couple = name.split(num),
      distance = offsets[couple[0]],
      octaveDiff = (couple[1] || octaveOffset) - octaveOffset,
      freq = middleC * Math.pow(Math.pow(2, 1 / 12), distance);
    return freq * Math.pow(2, octaveDiff);
  };

  // convert a duration string (e.g. 'q') to a number (e.g. 1)
  // also accepts numeric strings (e.g '0.125')
  // and compund durations (e.g. 'es' for dotted-eight or eighth plus sixteenth)
  Note.getDuration = function(symbol) {
    return numeric.test(symbol)
      ? parseFloat(symbol)
      : symbol
          .toLowerCase()
          .split('')
          .reduce(function(prev, curr) {
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
  };

  /*
 * Sequence class
 */

  // create a new Sequence
  function Sequence(ac, tempo, arr) {
    this.ac = ac || new AudioContext();
    this.createFxNodes();
    this.tempo = tempo || 120;
    this.loop = true;
    this.smoothing = 0;
    this.staccato = 0;
    this.notes = [];
    this.push.apply(this, arr || []);
  }

  // create gain and EQ nodes, then connect 'em
  Sequence.prototype.createFxNodes = function() {
    var eq = [['bass', 100], ['mid', 1000], ['treble', 2500]],
      prev = (this.gain = this.ac.createGain());
    eq.forEach(
      function(config, filter) {
        filter = this[config[0]] = this.ac.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = config[1];
        prev.connect((prev = filter));
      }.bind(this)
    );
    prev.connect(this.ac.destination);
    return this;
  };

  // accepts Note instances or strings (e.g. 'A4 e')
  Sequence.prototype.push = function() {
    Array.prototype.forEach.call(
      arguments,
      function(note) {
        this.notes.push(note instanceof Note ? note : new Note(note));
      }.bind(this)
    );
    return this;
  };

  // create a custom waveform as opposed to "sawtooth", "triangle", etc
  Sequence.prototype.createCustomWave = function(real, imag) {
    // Allow user to specify only one array and dupe it for imag.
    if (!imag) {
      imag = real;
    }

    // Wave type must be custom to apply period wave.
    this.waveType = 'custom';

    // Reset customWave
    this.customWave = [new Float32Array(real), new Float32Array(imag)];
  };

  // recreate the oscillator node (happens on every play)
  Sequence.prototype.createOscillator = function() {
    this.stop();
    this.osc = this.ac.createOscillator();

    // customWave should be an array of Float32Arrays. The more elements in
    // each Float32Array, the dirtier (saw-like) the wave is
    if (this.customWave) {
      this.osc.setPeriodicWave(
        this.ac.createPeriodicWave.apply(this.ac, this.customWave)
      );
    } else {
      this.osc.type = this.waveType || 'square';
    }

    this.osc.connect(this.gain);
    return this;
  };

  // schedules this.notes[ index ] to play at the given time
  // returns an AudioContext timestamp of when the note will *end*
  Sequence.prototype.scheduleNote = function(index, when) {
    var duration = (60 / this.tempo) * this.notes[index].duration,
      cutoff = duration * (1 - (this.staccato || 0));

    this.setFrequency(this.notes[index].frequency, when);

    if (this.smoothing && this.notes[index].frequency) {
      this.slide(index, when, cutoff);
    }

    this.setFrequency(0, when + cutoff);
    return when + duration;
  };

  // get the next note
  Sequence.prototype.getNextNote = function(index) {
    return this.notes[index < this.notes.length - 1 ? index + 1 : 0];
  };

  // how long do we wait before beginning the slide? (in seconds)
  Sequence.prototype.getSlideStartDelay = function(duration) {
    return duration - Math.min(duration, (60 / this.tempo) * this.smoothing);
  };

  // slide the note at <index> into the next note at the given time,
  // and apply staccato effect if needed
  Sequence.prototype.slide = function(index, when, cutoff) {
    var next = this.getNextNote(index),
      start = this.getSlideStartDelay(cutoff);
    this.setFrequency(this.notes[index].frequency, when + start);
    this.rampFrequency(next.frequency, when + cutoff);
    return this;
  };

  // set frequency at time
  Sequence.prototype.setFrequency = function(freq, when) {
    this.osc.frequency.setValueAtTime(freq, when);
    return this;
  };

  // ramp to frequency at time
  Sequence.prototype.rampFrequency = function(freq, when) {
    this.osc.frequency.linearRampToValueAtTime(freq, when);
    return this;
  };

  // run through all notes in the sequence and schedule them
  Sequence.prototype.play = function(when) {
    when = typeof when === 'number' ? when : this.ac.currentTime;

    this.createOscillator();
    this.osc.start(when);

    this.notes.forEach(
      function(note, i) {
        when = this.scheduleNote(i, when);
      }.bind(this)
    );

    this.osc.stop(when);
    this.osc.onended = this.loop ? this.play.bind(this, when) : null;

    return this;
  };

  // stop playback, null out the oscillator, cancel parameter automation
  Sequence.prototype.stop = function() {
    if (this.osc) {
      this.osc.onended = null;
      this.osc.disconnect();
      this.osc = null;
    }
    return this;
  };

  exports.Note = Note;
  exports.Sequence = Sequence;
});

/*
* Implementation
*/

// create the audio context
var ac = new AudioContext(),
  // get the current Web Audio timestamp (this is when playback should begin)
  when = ac.currentTime,
  // set the tempo
  tempo = 132,
  // initialize some vars
  sequence1,
  sequence2,
  sequence3,
  // create an array of "note strings" that can be passed to a sequence
  lead = [
    '-   e',
    'Bb3 e',
    'A3  e',
    'Bb3 e',
    'G3  e',
    'A3  e',
    'F3  e',
    'G3  e',

    'E3  e',
    'F3  e',
    'G3  e',
    'F3  e',
    'E3  e',
    'F3  e',
    'D3  q',

    '-   e',
    'Bb3 s',
    'A3  s',
    'Bb3 e',
    'G3  e',
    'A3  e',
    'G3  e',
    'F3  e',
    'G3  e',

    'E3  e',
    'F3  e',
    'G3  e',
    'F3  e',
    'E3  s',
    'F3  s',
    'E3  e',
    'D3  q',
  ],
  harmony = [
    '-   e',
    'D4  e',
    'C4  e',
    'D4  e',
    'Bb3 e',
    'C4  e',
    'A3  e',
    'Bb3 e',

    'G3  e',
    'A3  e',
    'Bb3 e',
    'A3  e',
    'G3  e',
    'A3  e',
    'F3  q',

    '-   e',
    'D4  s',
    'C4  s',
    'D4  e',
    'Bb3 e',
    'C4  e',
    'Bb3 e',
    'A3  e',
    'Bb3 e',

    'G3  e',
    'A3  e',
    'Bb3 e',
    'A3  e',
    'G3  s',
    'A3  s',
    'G3  e',
    'F3  q',
  ],
  bass = [
    'D3  q',
    '-   h',
    'D3  q',

    'A2  q',
    '-   h',
    'A2  q',

    'Bb2 q',
    '-   h',
    'Bb2 q',

    'F2  h',
    'A2  h',
  ];

// create 3 new sequences (one for lead, one for harmony, one for bass)
sequence1 = new TinyMusic.Sequence(ac, tempo, lead);
sequence2 = new TinyMusic.Sequence(ac, tempo, harmony);
sequence3 = new TinyMusic.Sequence(ac, tempo, bass);

// set staccato and smoothing values for maximum coolness
sequence1.staccato = 0.55;
sequence2.staccato = 0.55;
sequence3.staccato = 0.05;
sequence3.smoothing = 0.4;

// adjust the levels so the bass and harmony aren't too loud
sequence1.gain.gain.value = 1.0;
sequence2.gain.gain.value = 0.8;
sequence3.gain.gain.value = 0.65;

// apply EQ settings
sequence1.mid.frequency.value = 800;
sequence1.mid.gain.value = 3;
sequence2.mid.frequency.value = 1200;
sequence3.mid.gain.value = 3;
sequence3.bass.gain.value = 6;
sequence3.bass.frequency.value = 80;
sequence3.mid.gain.value = -6;
sequence3.mid.frequency.value = 500;
sequence3.treble.gain.value = -2;
sequence3.treble.frequency.value = 1400;

//start the lead part immediately
sequence1.play(when);
// delay the harmony by 16 beats
sequence2.play(when + (60 / tempo) * 16);
// start the bass part immediately
sequence3.play(when);
