export const isUndefined = (val: unknown): val is undefined => val === undefined;
export const isString = (val: unknown): val is string => typeof val === 'string';
