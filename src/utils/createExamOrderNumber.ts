import moment from 'moment';

export const createExamOrderNumber = (): string =>
  `${moment(new Date()).format('YYYYMMDDHHmmss')}${String(Math.trunc(Math.random() * 10000)).padStart(4, '0')}`;
