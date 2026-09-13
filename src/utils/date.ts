import moment from 'moment';

export const convertMinutesToTimeAmPm = (minutes: number): string => {
  return moment().startOf('day').add(minutes, 'minutes').format('hh:mm A');
};

export const convertMinutesToTime24 = (minutes: number): string => {
  return moment().startOf('day').add(minutes, 'minutes').format('HH:mm');
};

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

export const parseDateWithOffset = (date: any, offset: any) => {
  if (Date.parse(date)) {
    const oldDate = new Date(date);
    const number = isNaN(Number(offset)) ? 0 : Number(offset);

    return new Date(oldDate.setMinutes(oldDate.getMinutes() - number));
  }

  return null;
};
