var Bpm = (function() {
  function Bpm() {
    this.reset();
  }

  Bpm.prototype.tap = function() {

    var now = Date.now();

    if (this.lastTap) {
      var thisDelta = now - this.lastTap;
      this.lastTap = now;

      if (thisDelta > 3000) {
        this.reset();
        return;
      }

      // This logic seems backwards as we are calculating BPM so the lower
      // the delta the higher the BPM
      if (typeof this.max === 'undefined' || this.max > thisDelta) {
        this.max = thisDelta;
      }

      if (typeof this.min === 'undefined' || this.min < thisDelta) {
        this.min = thisDelta;
      }

      this.deltaSums += thisDelta;
      this.deltaCount += 1;

      return this.calculate();
    }

    this.lastTap = now;

  };

  Bpm.prototype.toMs = function(ms) {
    return 1000 / ms * 60;
  };

  Bpm.prototype.calculate = function() {
    return {
      avg: this.toMs(this.deltaSums / this.deltaCount),
      min: this.toMs(this.min),
      max: this.toMs(this.max),
    };
  };

  Bpm.prototype.reset = function() {
    this.lastTap = undefined;
    this.deltaSums = 0;
    this.deltaCount = 0;
    this.min = undefined;
    this.max = undefined;
  };

  return Bpm;
}());
