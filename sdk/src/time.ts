export const TIME = {
  SECOND: 1,
  get MINUTE() {
    return 60 * this.SECOND;
  },
  get HOUR() {
    return 60 * this.MINUTE;
  },
  get DAY() {
    return 24 * this.HOUR;
  },
  get WEEK() {
    return 7 * this.DAY;
  },
  get YEAR() {
    return 365 * this.DAY;
  },

  toMilliseconds(seconds: number) {
    return seconds * 1000;
  },
  get SECOND_MS() {
    return this.toMilliseconds(this.SECOND);
  },
  get HOUR_MS() {
    return this.toMilliseconds(this.HOUR);
  },
  get DAY_MS() {
    return this.toMilliseconds(this.DAY);
  },
  get WEEK_MS() {
    return this.toMilliseconds(this.WEEK);
  },
  get YEAR_MS() {
    return this.toMilliseconds(this.YEAR);
  },
};
