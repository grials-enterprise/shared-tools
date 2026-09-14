import moment from 'moment';

/**
 * Generates a unique exam order number composed of the current timestamp
 * (`YYYYMMDDHHmmss`) followed by 4 random digits.
 *
 * @returns An 18-digit order number string.
 *
 * @category String & Formatting
 */
export const createExamOrderNumber = (): string =>
  `${moment(new Date()).format('YYYYMMDDHHmmss')}${String(Math.trunc(Math.random() * 10000)).padStart(4, '0')}`;
