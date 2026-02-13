export const auditLog = (message, meta = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    message,
    meta
  };
  console.log(JSON.stringify(payload));
};
