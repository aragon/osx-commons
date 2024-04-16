import {TIME} from '../../src';

describe('time', () => {
  it('should return the correct time values', () => {
    expect(TIME.SECOND).toEqual(1);
    expect(TIME.MINUTE).toEqual(60);
    expect(TIME.HOUR).toEqual(60 * 60);
    expect(TIME.DAY).toEqual(60 * 60 * 24);
    expect(TIME.WEEK).toEqual(60 * 60 * 24 * 7);
    expect(TIME.YEAR).toEqual(60 * 60 * 24 * 365);
  });
});
