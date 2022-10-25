export const toTitleCase = (str: string) => {
  return str
    .replace(/(^|[_-])([a-z])/g, (a, b, c) => c.toUpperCase())
    .replace(/([a-z])([A-Z])/g, (a, b, c) => `${b} ${c}`);
};
