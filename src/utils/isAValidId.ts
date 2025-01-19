export const isAValidId = (id: string): boolean => {
  const regex = /^[a-zA-Z0-9]{24}$/;
  return regex.test(id);
};
