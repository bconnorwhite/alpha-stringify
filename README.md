<div align="center">
  <h1>alpha-stringify</h1>
  <a href="https://npmjs.com/package/alpha-stringify">
    <img alt="NPM" src="https://img.shields.io/npm/v/alpha-stringify.svg">
  </a>
  <a href="https://github.com/bconnorwhite/alpha-stringify">
    <img alt="TypeScript" src="https://img.shields.io/github/languages/top/bconnorwhite/alpha-stringify.svg">
  </a>
  <a href="https://coveralls.io/github/bconnorwhite/alpha-stringify?branch=master">
    <img alt="Coverage Status" src="https://coveralls.io/repos/github/bconnorwhite/alpha-stringify/badge.svg?branch=master">
  </a>
  <a href="https://github.com/bconnorwhite/alpha-stringify">
    <img alt="GitHub Stars" src="https://img.shields.io/github/stars/bconnorwhite/alpha-stringify?label=Stars%20Appreciated%21&style=social">
  </a>
  <a href="https://twitter.com/bconnorwhite">
    <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/bconnorwhite.svg?label=%40bconnorwhite&style=social">
  </a>
</div>

<br />

> Serialize anything, and sort keys for equality comparison.

## Installation

```sh
yarn add alpha-stringify
```

```sh
npm install alpha-stringify
```
## Example Usage
```ts
import stringify from "alpha-stringify";

const cache = new Map();

function memoizedFunction(x: any) {
  if(cache.has(stringify(x))) {
    return cache.get(stringify(x));
  } else {
    cache.set(stringify(x), x);
  }
}
```

## Supported Types
```ts
import stringify from "alpha-stringify";

// Some primitives behave the same as JSON.stringify:

stringify(true);      // true
stringify("test");    // "test"
stringify(null);      // null

// Numbers use the `.toString()` method instead, which helps with Infinity and NaN:

stringify(1);         // 1
stringify(Infinity);  // Infinity
stringify(NaN);       // NaN

// Other types are serialized as they would be written in JavaScript:

stringify(BigInt(9007199254740991));      // BigInt(9007199254740991)
stringify(Symbol("Sym"));                 // Symbol("Sym")
stringify(new Date());                    // new Date(1619932122057)
stringify(/test/);                        // /test/
stringify(new RegExp(/test/));            // /test/
stringify(new Set(["a", "b"]));           // new Set(["a","b"])
stringify(new Map([["a", 1], ["b", 2]])); // new Map([["a",1],["b",2]])

// There are a few exceptions to this rule though:

stringify(new Error("ok"));                 // Error: ok
stringify(new WeakSet([{ a: 1, b: 2 }]));   // [object WeakSet]
stringify(new WeakMap([[{ a: 1 }, "b"]]));  // [object WeakMap]
stringify(new Promise(() => {}));           // [object Promise]

// Arrays are not sorted by default, but can be with the `sortArrays` option:

stringify(["b", "a"]);                        // ["b","a"]
stringify(["b", "a"], { sortArrays: true });  // ["a","b"]

// Objects are sorted by default, but can be disabled with the `sortObjects` option:

stringify({ b: 1, a: 2 });                          // {"a":2,"b":1}
stringify({ b: 1, a: 2 }, { sortObjects: false });  // {"b":1,"a":2}

// Functions and are also supported:

stringify(() => 5);                               // () => 5
stringify(function testFunction() { return 5; }); // function testFunction() { return 5; }
stringify(console.info);                          // function () { [native code] }

// Classes are stringified to their constructor, plus value:

class TestClass {
  constructor(color: string) {
    this.color = color;
  }
  getColor() {
    return this.color.toUpperCase();
  }
}
stringify(new TestClass("red"));
// class TestClass {
//   constructor(color) {
//     this.color = color;
//   }
//   getColor() {
//     return this.color.toUpperCase();
//   }
// }
// '{"color":"red"}'
  

// Other edge cases:

stringify(undefined);   // undefined
stringify(globalThis);  // globalThis
stringify(Math);        // Math

// Circular dependencies are supported:

const x = { a: 1 };
x.b = x;
stringify(x); // {"a":1,"b":[Circular]}

```
### Types
```ts
import stringify, { Options } from "alpha-stringify";

function stringify(value: any, options?: Options): string;

type Options = {
  /**
   * Sort object keys. Default: `true`.
   */
  sortObjects?: boolean;
  /**
   * Sort array items. Default: `false`.
   */
  sortArrays?: boolean;
};
```

<br />

<h2>Dev Dependencies<img align="right" alt="David" src="https://img.shields.io/david/dev/bconnorwhite/alpha-stringify.svg"></h2>

- [@bconnorwhite/bob](https://www.npmjs.com/package/@bconnorwhite/bob): Bob is a toolkit for TypeScript projects

<br />

<h2>License <img align="right" alt="license" src="https://img.shields.io/npm/l/alpha-stringify.svg"></h2>

[MIT](https://opensource.org/licenses/MIT)
