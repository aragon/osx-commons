import {TIME} from '../../src';

describe('time', () => {
  it('should return the correct time values', () => {
    expect(TIME.SECOND).toEqual(1);
    expect(TIME.MINUTE).toEqual(60 * TIME.SECOND);
    expect(TIME.HOUR).toEqual(60 * TIME.MINUTE);
    expect(TIME.DAY).toEqual(24 * TIME.HOUR);
    expect(TIME.WEEK).toEqual(7 * TIME.DAY);
    expect(TIME.YEAR).toEqual(365 * TIME.DAY);
  });
});
