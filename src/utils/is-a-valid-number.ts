export const isAValidNumber = (value: string): boolean => {
  const regex: RegExp = /^[0-9]\d{0,2}$/;
  return regex.test(value);
};
