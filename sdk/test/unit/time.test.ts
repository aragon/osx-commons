import {TIME} from '../../src';

describe('time', () => {
  it('should return the correct time values', () => {
    expect(TIME.SECOND).toEqual(1);
    expect(TIME.MINUTE).toEqual(60);
    expect(TIME.HOUR).toEqual(3600);
    expect(TIME.DAY).toEqual(86400);
    expect(TIME.WEEK).toEqual(604800);
    expect(TIME.YEAR).toEqual(31536000);
  });
});
