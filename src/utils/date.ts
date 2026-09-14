import moment from 'moment';

/**
 * Converts a number of minutes since midnight into a 12-hour (AM/PM) time string.
 *
 * @param minutes - Minutes elapsed since midnight.
 * @returns Formatted time like `'01:30 PM'`.
 *
 * @category Date
 */
export const convertMinutesToTimeAmPm = (minutes: number): string => {
  return moment().startOf('day').add(minutes, 'minutes').format('hh:mm A');
};

/**
 * Converts a number of minutes since midnight into a 24-hour time string.
 *
 * @param minutes - Minutes elapsed since midnight.
 * @returns Formatted time like `'13:30'`.
 *
 * @category Date
 */
export const convertMinutesToTime24 = (minutes: number): string => {
  return moment().startOf('day').add(minutes, 'minutes').format('HH:mm');
};

/**
 * Returns the current date together with the previous and next month.
 *
 * @returns An object with `currentDate`, `previousMonth` and `nextMonth`.
 *
 * @category Date
 */
export const getDateWithMonthRange = (): {
  currentDate: Date;
  previousMonth: Date;
  nextMonth: Date;
} => {
  const now = new Date();
  return {
    currentDate: now,
    previousMonth: moment(now).subtract(1, 'month').toDate(),
    nextMonth: moment(now).add(1, 'month').toDate(),
  };
};

/**
 * Parses a time string into milliseconds.
 *
 * @param time - Time string composed of a number and a unit (`s`, `m`, `h` or `d`), e.g. `'5s'`.
 * @returns The equivalent in milliseconds.
 * @throws {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} if the format is invalid.
 *
 * @category Date
 */
export const parseTimeToMiliseconds = (time: string): number | undefined => {
  const validTime = ['s', 'm', 'h', 'd'].includes(time.replace(/[0-9]/g, ''));
  if (!validTime) {
    throw new Error('Invalid time format. Use "s", "m", "h", or "d".');
  }

  const numberTime = parseInt(time.replace(/[^0-9]/g, ''), 10);
  const unit = time.replace(/[0-9]/g, '');

  switch (unit) {
    case 's':
      return 1000 * numberTime;
    case 'm':
      return 60 * 1000 * numberTime;
    case 'h':
      return 60 * 60 * 1000 * numberTime;
    case 'd':
      return 24 * 60 * 60 * 1000 * numberTime;
  }
};

/**
 * Parses a date and subtracts an offset (in minutes).
 *
 * @param date - Value parsable by `Date.parse`.
 * @param offset - Number of minutes to subtract (invalid values default to `0`).
 * @returns A new `Date` with the offset applied, or `null` if `date` is not a valid date.
 *
 * @category Date
 */
export const parseDateWithOffset = (date: any, offset: any) => {
  if (Date.parse(date)) {
    const oldDate = new Date(date);
    const number = isNaN(Number(offset)) ? 0 : Number(offset);

    return new Date(oldDate.setMinutes(oldDate.getMinutes() - number));
  }

  return null;
};
