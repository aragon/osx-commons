// Time-related constants.
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
};
