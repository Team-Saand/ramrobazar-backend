export function successResponse(data: any, message: string) {
  return {
    status: 'success',
    timestamp: new Date().toISOString(),
    data,
    message,
  };
}
