export const isEmpty = (value: any) => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0)
  );
};

export const isNumber = (value: any) => !isNaN(Number(value));