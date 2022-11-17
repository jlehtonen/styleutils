import { Color } from "../color/color.js";
import { formatShadowLengthValue, generateShadows, shadow, shadows } from "./shadow.js";

describe("formatShadowLengthValue", () => {
  test.each([
    [0, "0"],
    [1, "1px"],
    [-1, "-1px"],
    [-234, "-234px"],
    [0.5, "0.5px"],
    [-0.5, "-0.5px"],
    [0.123, "0.123px"],
    ["0", "0"],
    ["1px", "1px"],
    ["-1px", "-1px"],
    ["-234px", "-234px"],
    ["0.5rem", "0.5rem"],
  ])(
    "returns correct value on valid input (input = %s, output = %s)",
    (input, output) => {
      expect(formatShadowLengthValue(input)).toBe(output);
    }
  );
});

test.each([
  [{}, "0 0"],
  [{ x: 0 }, "0 0"],
  [{ x: 1 }, "1px 0"],
  [{ x: -0.23 }, "-0.23px 0"],
  [{ x: "2px" }, "2px 0"],
  [{ x: "-3rem" }, "-3rem 0"],
  [{ x: "0" }, "0 0"],
  [{ y: 0 }, "0 0"],
  [{ y: 3 }, "0 3px"],
  [{ y: "4em" }, "0 4em"],
  [{ blur: 0 }, "0 0"],
  [{ blur: 1 }, "0 0 1px"],
  [{ blur: "2em" }, "0 0 2em"],
  [{ spread: 0 }, "0 0"],
  [{ spread: 1 }, "0 0 0 1px"],
  [{ color: "currentcolor" }, "0 0"],
  [{ color: "currentColor" }, "0 0"],
  [{ color: "cUrRenTcoLoR" }, "0 0"],
  [{ color: "#000" }, "0 0 #000"],
  [{ inset: false }, "0 0"],
  [{ inset: true }, "0 0 inset"],
  [{ x: 1, y: 2 }, "1px 2px"],
  [{ x: 1, blur: 10 }, "1px 0 10px"],
  [{ x: 1, spread: 10 }, "1px 0 0 10px"],
  [{ spread: 10, color: "currentcolor" }, "0 0 0 10px"],
  [{ spread: 10, color: "red" }, "0 0 0 10px red"],
  [{ blur: 10, color: "red" }, "0 0 10px red"],
  [{ blur: 10, color: "red", inset: true }, "0 0 10px red inset"],
  [{ color: "red", inset: true }, "0 0 red inset"],
  [
    { x: 10, y: -20, blur: "1rem", spread: "0.5em", color: "red", inset: true },
    "10px -20px 1rem 0.5em red inset",
  ],
])("shadow returns correct shadow (input = %s, output = %s)", (input, output) => {
  expect(shadow(input)).toBe(output);
});

test.each([
  [[{}], "0 0"],
  [[{ x: 1 }], "1px 0"],
  [[{}, {}], "0 0, 0 0"],
  [[{}, {}, {}], "0 0, 0 0, 0 0"],
  [[{}, { y: 12 }], "0 0, 0 12px"],
  [[{ y: 10, color: "red", spread: 0 }, { y: 12 }], "0 10px red, 0 12px"],
  [[{ y: 10, color: "red", spread: 1 }, { y: 12 }], "0 10px 0 1px red, 0 12px"],
  [[{ color: "red" }, { inset: true }, {}], "0 0 red, 0 0 inset, 0 0"],
])("shadows returns correct shadow (input = %s, output = %s)", (input, output) => {
  expect(shadows(...input)).toBe(output);
});

test.each([
  [1, {}, `0 1px 1px ${new Color(0, 0, 0, 30).hex}`],
  [
    2,
    {},
    `0 1px 1px ${new Color(0, 0, 0, 15).hex}, 0 2px 2px ${new Color(0, 0, 0, 15).hex}`,
  ],
  [
    3,
    {},
    `0 1px 1px ${new Color(0, 0, 0, 10).hex}, 0 2px 2px ${
      new Color(0, 0, 0, 10).hex
    }, 0 4px 4px ${new Color(0, 0, 0, 10).hex}`,
  ],
  [1, { x: () => 10 }, `10px 1px 1px ${new Color(0, 0, 0, 30).hex}`],
  [1, { y: () => 0 }, `0 0 1px ${new Color(0, 0, 0, 30).hex}`],
  [1, { blur: (): number => 0 }, `0 1px ${new Color(0, 0, 0, 30).hex}`],
  [
    1,
    { blur: (): number => 0, color: () => "currentColor", inset: true },
    `0 1px inset`,
  ],
])(
  "generateShadows returns correct shadows (input = %s, output = %s)",
  (n, options, output) => {
    expect(generateShadows(n, options)).toBe(output);
  }
);
