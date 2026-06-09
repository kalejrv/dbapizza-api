export class MulterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MulterError";
  };
};
