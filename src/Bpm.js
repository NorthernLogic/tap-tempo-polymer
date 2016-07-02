var Bpm = (function() {
  function Bpm(sampleSize) {
    if (sampleSize === void 0) { sampleSize = 100; }
    this.sampleSize = sampleSize;
    this.taps = [];
    this.deltas = [];
    if (this.sampleSize < 2) {
      throw new Error('sampleSize must be greater than 1');
    }
  }

  Bpm.prototype.tap = function() {

    var now = Date.now();

    if (this.lastTap && (now - this.lastTap) > 3000) {
      this.reset();
    }

    this.taps.push(now);

    if (this.taps.length > this.sampleSize) {
      this.taps.shift();
    }

    this.lastTap = now;

    return this.calculate();
  };

  Bpm.prototype.toMs = function(ms) {
    return 1000 / ms * 60;
  };

  Bpm.prototype.calculate = function() {
    var lastTwo = this.taps.slice(-2, this.numTaps);

    if (lastTwo.length != 2) {
      return;
    }

    var difference = lastTwo[1] - lastTwo[0];

    this.deltas.push(difference);
    if (this.deltas.length > this.sampleSize) {
      this.deltas.shift();
    }

    // This logic seems backwards as we are calculating BPM so the lower the difference
    // the higher the BPM
    if (typeof this.max === 'undefined' || this.max > difference) {
      this.max = difference;
    }

    if (typeof this.min === 'undefined' || this.min < difference) {
      this.min = difference;
    }

    return {
      avg: this.toMs(this.deltas.reduce(function(acc, num) { return acc + num; }, 0) / this.deltas.length),
      min: this.toMs(this.min),
      max: this.toMs(this.max),
    };
  };

  Bpm.prototype.reset = function() {
    this.taps = [];
    this.deltas = [];
    this.min = undefined;
    this.max = undefined;
  };

  return Bpm;
}());
