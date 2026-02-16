export const isUndefined = (val: unknown): val is undefined => val === undefined;
export const isString = (val: unknown): val is string => typeof val === 'string';
// eslint-disable-next-line ts/no-unsafe-function-type
export const isFunction = (val: unknown): val is Function => typeof val === 'function';
