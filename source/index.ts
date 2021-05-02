/* eslint-disable no-proto */

export type Options = {
  /**
   * Sort object keys. Default: `true`.
   */
  sortObjects?: boolean;
  /**
   * Sort array items. Default: `false`.
   */
  sortArrays?: boolean;
};

type InternalOptions = Options & {
  seen?: WeakSet<any>;
};

function csv(value: Record<string, any>, options: InternalOptions) {
  const seen = options.seen ?? new WeakSet();
  seen.add(value);
  const sortedValue = Array.isArray(value) && options.sortArrays ? value.sort() : value;
  const sortObject = !Array.isArray(sortedValue) && options.sortObjects !== false;
  const keys = sortObject ? Object.keys(sortedValue).sort() : Object.keys(sortedValue);
  return keys.reduce((retval, key) => {
    const lead = `${retval}${retval ? "," : ""}`;
    const prefix = Array.isArray(sortedValue) ? "" : `"${key}":`;
    if(typeof sortedValue[key] === "object" && seen.has(sortedValue[key])) {
      return `${lead}${prefix}[Circular]`;
    } else {
      if(typeof sortedValue[key] === "object") {
        seen.add(sortedValue[key]);
      }
      return `${lead}${prefix}${stringify(sortedValue[key], { ...options, seen })}`;
    }
  }, "");
}

export default function stringify(value: any, options: InternalOptions = {}): string {
  if(typeof value === "string" || typeof value === "boolean" || value === null) {
    return JSON.stringify(value);
  } else if(typeof value === "object") {
    if(value instanceof Array) {
      return `[${csv(value, options)}]`;
    } else if(value instanceof Date) {
      return `new Date(${value.getTime()})`;
    } else if(value instanceof RegExp || value instanceof Error) {
      return value.toString();
    } else if(value instanceof Set) {
      const array = options.sortArrays ? Array.from(value).sort() : Array.from(value);
      return `new Set(${JSON.stringify(array)})`;
    } else if(value instanceof Map) {
      const array = options.sortObjects !== false ? Array.from(value).sort() : Array.from(value);
      return `new Map(${JSON.stringify(array)})`;
    } else if(value instanceof WeakSet) {
      return value.toString();
    } else if(value instanceof WeakMap) {
      return value.toString();
    } else if(value === globalThis) {
      return "globalThis";
    } else if(value === Math) {
      return "Math";
    } else if(typeof value.then === "function" && typeof value.catch === "function") {
      return value.toString();
    } else if((/\{\s*\[native code\]\s*\}/g).exec(value.__proto__.constructor.toString())) {
      return `{${csv(value, options)}}`;
    } else {
      return `${value.__proto__.constructor}\n${JSON.stringify(value)}`;
    }
  } else if(value === undefined) {
    return "undefined";
  } else if(typeof value === "bigint") {
    return `BigInt(${value.toString()})`;
  } else if(typeof value === "symbol") {
    return `Symbol("${value.description}")`;
  } else { // typeof value === "function", or "number"
    return value.toString();
  }
}
