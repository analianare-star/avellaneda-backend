export const success = (data: any) => ({
  status: 'success',
  data,
});

export const error = (message: string) => ({
  status: 'error',
  message,
});