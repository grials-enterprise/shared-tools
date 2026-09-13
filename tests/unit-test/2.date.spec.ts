import assert from 'assert';
import { TEST_EXECUTE } from '../setup';
import {
  convertMinutesToTimeAmPm,
  convertMinutesToTime24,
  getDateWithMonthRange,
  parseTimeToMiliseconds,
  parseDateWithOffset,
} from '../../src/utils/date';

describe('utils - date', function () {
  if (!(TEST_EXECUTE === 'ALL' || TEST_EXECUTE === '2')) {
    return;
  }

  it('success, convertMinutesToTimeAmPm', () => {
    assert.strictEqual(convertMinutesToTimeAmPm(0), '12:00 AM');
    assert.strictEqual(convertMinutesToTimeAmPm(60), '01:00 AM');
    assert.strictEqual(convertMinutesToTimeAmPm(13 * 60), '01:00 PM');
    assert.strictEqual(convertMinutesToTimeAmPm(23 * 60 + 59), '11:59 PM');
  });

  it('success, convertMinutesToTime24', () => {
    assert.strictEqual(convertMinutesToTime24(0), '00:00');
    assert.strictEqual(convertMinutesToTime24(60), '01:00');
    assert.strictEqual(convertMinutesToTime24(13 * 60), '13:00');
    assert.strictEqual(convertMinutesToTime24(23 * 60 + 30), '23:30');
  });

  it('success, getDateWithMonthRange', () => {
    const result = getDateWithMonthRange();
    assert.strictEqual(result.currentDate instanceof Date, true);
    assert.strictEqual(result.previousMonth instanceof Date, true);
    assert.strictEqual(result.nextMonth instanceof Date, true);

    const current = result.currentDate;
    assert.strictEqual(result.previousMonth.getMonth(), (current.getMonth() + 11) % 12);
    assert.strictEqual(result.nextMonth.getMonth(), (current.getMonth() + 1) % 12);
  });

  it('success, parseTimeToMiliseconds - all units', () => {
    assert.strictEqual(parseTimeToMiliseconds('1s'), 1000);
    assert.strictEqual(parseTimeToMiliseconds('1m'), 60 * 1000);
    assert.strictEqual(parseTimeToMiliseconds('1h'), 60 * 60 * 1000);
    assert.strictEqual(parseTimeToMiliseconds('1d'), 24 * 60 * 60 * 1000);
    assert.strictEqual(parseTimeToMiliseconds('5s'), 5000);
    assert.strictEqual(parseTimeToMiliseconds('10m'), 10 * 60 * 1000);
  });

  it('error, parseTimeToMiliseconds - invalid format', () => {
    assert.throws(() => parseTimeToMiliseconds('1x'), /Invalid time format/);
    assert.throws(() => parseTimeToMiliseconds('abc'), /Invalid time format/);
    assert.throws(() => parseTimeToMiliseconds(''), /Invalid time format/);
  });

  it('success, parseDateWithOffset', () => {
    const date = '2025-01-01T12:00:00.000Z';
    const result = parseDateWithOffset(date, 30);
    assert.strictEqual(result instanceof Date, true);
    const expected = new Date(new Date(date).getTime() - 30 * 60 * 1000);
    assert.strictEqual(result?.getTime(), expected.getTime());
  });

  it('success, parseDateWithOffset - invalid date returns null', () => {
    assert.strictEqual(parseDateWithOffset('not-a-date', 10), null);
    assert.strictEqual(parseDateWithOffset(undefined, 10), null);
    assert.strictEqual(parseDateWithOffset('', 10), null);
  });

  it('success, parseDateWithOffset - invalid offset defaults to 0', () => {
    const date = '2025-01-01T12:00:00.000Z';
    const result = parseDateWithOffset(date, 'invalid');
    assert.strictEqual(result?.getTime(), new Date(date).getTime());
    const result2 = parseDateWithOffset(date, undefined);
    assert.strictEqual(result2?.getTime(), new Date(date).getTime());
  });
});
