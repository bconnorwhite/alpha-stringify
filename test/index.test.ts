import { test, expect } from "@jest/globals";
import stringify from "../source";

test("boolean", () => {
  expect(stringify(true)).toBe("true");
});

test("string", () => {
  expect(stringify("test")).toBe('"test"');
});

test("number", () => {
  expect(stringify(10)).toBe("10");
});

test("null", () => {
  expect(stringify(null)).toBe("null");
});

test("undefined", () => {
  expect(stringify(undefined)).toBe("undefined");
});

test("NaN", () => {
  expect(stringify(NaN)).toBe("NaN");
});

test("bigint", () => {
  expect(stringify(BigInt(9007199254740991))).toBe("BigInt(9007199254740991)");
});

test("symbol", () => {
  expect(stringify(Symbol("Sym"))).toBe('Symbol("Sym")');
});

test("infinity", () => {
  expect(stringify(Infinity)).toBe("Infinity");
});

test("object", () => {
  expect(stringify({ b: 2, a: "ok" })).toBe('{"a":"ok","b":2}');
});

test("object no sort", () => {
  expect(stringify({ b: 2, a: "ok" }, { sortObjects: false })).toBe('{"b":2,"a":"ok"}');
});

test("date", () => {
  expect(stringify(new Date(0))).toBe("new Date(0)");
});

test("regex", () => {
  expect(stringify(/test/)).toBe("/test/");
  expect(stringify(new RegExp(/test/))).toBe("/test/");
});

test("error", () => {
  expect(stringify(new Error())).toBe("Error");
  expect(stringify(new EvalError())).toBe("EvalError");
  expect(stringify(new Error("ok"))).toBe("Error: ok");
});

test("set", () => {
  expect(stringify(new Set(["a", "b"]))).toBe('new Set(["a","b"])');
  expect(stringify(new Set(["b", "a"]))).toBe('new Set(["b","a"])');
  expect(stringify(new Set(["b", "a"]), { sortArrays: true })).toBe('new Set(["a","b"])');
});

test("map", () => {
  expect(stringify(new Map([["a", 1], ["b", 2]]))).toBe('new Map([["a",1],["b",2]])');
  expect(stringify(new Map([["b", 2], ["a", 1]]))).toBe('new Map([["a",1],["b",2]])');
  expect(stringify(new Map([["b", 2], ["a", 1]]), { sortObjects: false })).toBe('new Map([["b",2],["a",1]])');
});

test("weak set", () => {
  expect(stringify(new WeakSet([{ a: 1, b: 2 }]))).toBe("[object WeakSet]");
});

test("weak map", () => {
  expect(stringify(new WeakMap([[{ a: 1 }, "b"]]))).toBe("[object WeakMap]");
});

test("array", () => {
  expect(stringify(["b", 2, 1, "a"])).toBe('["b",2,1,"a"]');
});

test("array sorted", () => {
  expect(stringify(["b", 2, 1, "a"], { sortArrays: true })).toBe('[1,2,"a","b"]');
});

test("array of objects", () => {
  expect(stringify([{ a: 1 }, { b: 2 }])).toBe('[{"a":1},{"b":2}]');
});

test("promise", () => {
  expect(stringify(new Promise(() => {}))).toBe("[object Promise]");
});

test("class", () => {
  class TestClass {
    color: string;
    __proto__: any;
    constructor(color: string) {
      this.color = color;
    }
    getColor() {
      return this.color.toUpperCase();
    }
  }
  const instance1 = new TestClass("red");
  const instance2 = new TestClass("red");
  // eslint-disable-next-line no-proto
  expect(stringify(instance1)).toBe(`${instance2.__proto__.constructor}\n${JSON.stringify(instance2)}`);
});

test("function", () => {
  // eslint-disable-next-line brace-style, max-statements-per-line
  function testFunction() { return 5; }
  expect(stringify(testFunction)).toBe("function testFunction() { return 5; }");
});

test("arrow function", () => {
  expect(stringify(() => 5)).toBe("() => 5");
});

test("builtin function", () => {
  expect(stringify(console.info)).toBe("function () { [native code] }");
});

test("globalThis", () => {
  expect(stringify(globalThis)).toBe("globalThis");
});

test("math", () => {
  expect(stringify(Math)).toBe("Math");
});

test("math function", () => {
  expect(stringify(Math.abs)).toBe("function abs() { [native code] }");
});

test("circular", () => {
  const x = { a: 1, b: {}, c: { d: {} } };
  x.b = x;
  x.c.d = x;
  expect(stringify(x)).toBe('{"a":1,"b":[Circular],"c":{"d":[Circular]}}');
});
