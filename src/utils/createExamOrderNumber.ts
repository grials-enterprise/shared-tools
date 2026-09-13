import moment from 'moment';

export const createExamOrderNumber = (): string =>
  `${moment(new Date()).format('YYYYMMDDHHmmss')}${Math.trunc(Math.random() * 9999)}`;
