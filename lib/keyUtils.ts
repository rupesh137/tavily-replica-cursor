export const cryptoRandom = (length: number) =>
  Array.from({ length }, () =>
    Math.floor(Math.random() * 36)
      .toString(36)
      .toUpperCase(),
  ).join("");

export const generateKeyPrefix = () => cryptoRandom(6);

