export const applyStringMask = (mask: string, valueToChange: string = '') => {
  const value = valueToChange
    ? valueToChange
        .replace(/[^A-Z0-9]/gi, '')
        .split('')
        .reverse()
    : [];
  if (mask) {
    const newMask = mask.split('').reverse();
    for (let index = 0; index < value.length; index++) {
      const chartCodeMask = newMask[index].codePointAt(0);
      if (chartCodeMask === 48) {
        continue;
      }

      value.splice(index, 0, newMask[index]);
      index = index + 2;

      if (index >= newMask.length - 1) {
        break;
      }
    }
  }

  return value.reverse().join('');
};
