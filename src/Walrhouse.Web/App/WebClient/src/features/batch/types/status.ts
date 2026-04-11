export const BatchStatus = {
  Released: 1,
  Locked: 2,
  Restricted: 3,
};

export type BatchStatus = (typeof BatchStatus)[keyof typeof BatchStatus];
