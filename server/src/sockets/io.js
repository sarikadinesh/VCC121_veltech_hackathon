let ioInstance = null;

export const setIo = (io) => {
  ioInstance = io;
};

export const emitUpdate = (event, payload) => {
  if (!ioInstance) {
    return;
  }
  ioInstance.emit(event, payload);
};
