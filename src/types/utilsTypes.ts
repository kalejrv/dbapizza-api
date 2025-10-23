/* Create Token. */
export interface Payload {
  id: string;
};

/* Make all optional all properties of a type. */
export type OptionalType<T> = {
  [K in keyof T]?: T[K];
};
