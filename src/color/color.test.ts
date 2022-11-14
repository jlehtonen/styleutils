import { Color } from "./color";

const isGrayscale = (hex: string) => {
  if (hex.length !== 7) {
    throw new Error(`Invalid hex: ${hex}`);
  }
  const r = hex.slice(1, 3);
  const g = hex.slice(3, 5);
  const b = hex.slice(5, 7);
  return r === g && g === b;
};

test.each([
  "#000000",
  "#ffffff",
  "#ff0000",
  "#d27c65",
  "#2f3529",
  "#b3ffd3",
  "#66815f",
])("Unmodified color returns same hex (%s)", (hex) => {
  expect(Color.fromHex(hex).hex).toBe(hex);
});

test.each([
  ["#000", "#000000"],
  ["#fff", "#ffffff"],
  ["#f00", "#ff0000"],
])("Hex shorthands work correctly (%s -> %s)", (shorthand, hex) => {
  expect(Color.fromHex(shorthand).hex).toBe(hex);
});

test.each([
  ["#000000", 0],
  ["#000000", 100],
  ["#000000", 55],
  ["#ffffff", 94],
  ["#adadad", 241],
  ["#666666", 10],
  ["#222222", 97],
  ["#222222", 0.3],
])(
  "Setting the hue of grayscale colors returns the same color (hex = %s, h = %s)",
  (hex, h) => {
    expect(Color.fromHex(hex).h(h).hex).toBe(hex);
  }
);

test.each([
  ["#000000", 0],
  ["#000000", 10],
  ["#000000", 50],
  ["#ffffff", 94],
  ["#adadad", -123],
  ["#666666", -34],
  ["#222222", 947],
  ["#222222", 0.1],
])(
  "Shifting hue of grayscale colors returns the same color (hex = %s, shift = %s)",
  (hex, shift) => {
    expect(Color.fromHex(hex).dh(shift).hex).toBe(hex);
  }
);

test.each([
  ["#ff0000", 10],
  ["#3b644b", 34],
  ["#fc7e59", 87],
  ["#150baf", -341],
  ["#150baf", 99],
  ["#150baf", 101],
  ["#30912f", 50],
])(
  "Shifting hue of non-grayscale color returns different color (hex = %s, shift = %s)",
  (hex, shift) => {
    const color = Color.fromHex(hex).dh(shift);
    expect(color.hex).not.toBe(hex);
  }
);

test.each([
  ["#ff0000", 0],
  ["#3b644b", 100],
  ["#fc7e59", 200],
  ["#150baf", -300],
])(
  "Shifting hue by multiple of 100 returns the same color (hex = %s, shift = %s)",
  (hex, shift) => {
    const color = Color.fromHex(hex).dh(shift);
    expect(color.hex).toBe(hex);
  }
);

test.each([
  ["#ff0000", 10],
  ["#3b644b", 34],
  ["#fc7e59", 87],
  ["#150baf", -341],
  ["#ffffff", 29],
  ["#000000", -547],
])(
  "Shifting and then unshifting hue returns the same color (hex = %s, shift = %s)",
  (hex, shift) => {
    const color = Color.fromHex(hex).dh(shift).dh(-shift);
    expect(color.hex).toBe(hex);
  }
);

test.each([
  ["#ff0000", 0],
  ["#3b644b", 100],
  ["#fc7e59", 200],
  ["#150baf", -300],
])(
  "Shifting hue by multiple of 100 returns the same color (hex = %s, shift = %s)",
  (hex, shift) => {
    const color = Color.fromHex(hex).dh(shift);
    expect(color.hex).toBe(hex);
  }
);

test.each([
  "#000000",
  "#ffffff",
  "#adadad",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#e4bd40",
  "#f1bccd",
  "#1de831",
  "#fc1a71",
])("Setting saturation to zero returns grayscale color (hex = %s)", (hex) => {
  const newHex = Color.fromHex(hex).s(0).hex;
  expect(isGrayscale(newHex)).toBeTruthy();
});

test.each([
  ["#000000", 123],
  ["#ffffff", 6],
  ["#adadad", 334],
  ["#666666", 0.5],
  ["#222222", -23],
  ["#e0e0e0", 67],
  ["#121212", 100],
  ["#121212", 0],
  ["#121212", 1],
])(
  "Setting saturation of grayscale color returns the same color (hex = %s, s = %s)",
  (hex, s) => {
    expect(Color.fromHex(hex).s(s).hex).toBe(hex);
  }
);

test.each(["#ff0000", "#00ff00", "#0000ff", "#00ffff", "#ff00ff", "#ffff00"])(
  "Setting saturation to 100 returns maximally saturated color (hex = %s)",
  (hex) => {
    const mutedColor = Color.fromHex(hex).ds(-12.34);
    expect(mutedColor.s(100).hex).toBe(hex);
  }
);

test.each([
  ["#ff0000", 99],
  ["#00ff00", 90],
  ["#0000ff", -100],
  ["#00ffff", 0],
  ["#ff00ff", 50],
  ["#ffff00", 10],
])(
  "Setting saturation to <100 returns less than maximally saturated color (hex = %s, s = %s)",
  (hex, s) => {
    const mutedColor = Color.fromHex(hex).ds(-12.34);
    expect(mutedColor.s(s).hex).not.toBe(hex);
  }
);

test.each([
  ["#000000", 123],
  ["#ffffff", 6],
  ["#adadad", -334],
  ["#666666", 0.5],
  ["#222222", -23],
  ["#e0e0e0", 67],
  ["#121212", 100],
  ["#121212", 0],
])(
  "Shifting saturation of grayscale color returns the same color (hex = %s, shift = %s)",
  (hex, shift) => {
    expect(Color.fromHex(hex).ds(shift).hex).toBe(hex);
  }
);

test.each([
  "#000000",
  "#ffffff",
  "#adadad",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#e4bd40",
  "#f1bccd",
  "#1de831",
  "#fc1a71",
])("Shifting saturation by 0 returns the same color (hex = %s)", (hex) => {
  expect(Color.fromHex(hex).ds(0).hex).toBe(hex);
});

test.each([
  ["#ff0000", 10],
  ["#00ff00", 34],
  ["#0000ff", 87],
  ["#0000ff", 1],
  ["#0000ff", 0],
])(
  "Increasing saturation of maximally saturated color returns the same color (hex = %s, shift = %s)",
  (hex, shift) => {
    const color = Color.fromHex(hex).ds(shift);
    expect(color.hex).toBe(hex);
  }
);

test.each([
  ["#a04fbd", -10],
  ["#aaba8f", 12],
  ["#998231", 1],
  ["#ad5776", -20],
  ["#9c6e5d", 15],
  ["#7cc97b", 0],
])(
  "Shifting and then unshifting saturation returns the same color (hex = %s, shift = %s)",
  (hex, shift) => {
    const color = Color.fromHex(hex).ds(shift).ds(-shift);
    expect(color.hex).toBe(hex);
  }
);

// Lightness

test.each([
  ["#000000", 0],
  ["#000000", -10],
  ["#ffffff", -1],
  ["#ffffff", -10],
  ["#adadad", -10],
  ["#adadae", -10],
  ["#ff0000", -100],
  ["#ff0000", -10],
  ["#00ff00", -0.1],
  ["#0000ff", -0],
  ["#e4bd40", -0.0001],
  ["#f1bccd", -345935],
  ["#1de831", 0],
  ["#fc1a71", 0],
])("Setting lightness to <= 0 returns black (hex = %s, l = %s)", (hex, l) => {
  expect(Color.fromHex(hex).l(l).hex).toBe("#000000");
});

test.each([
  ["#000000", 100],
  ["#ffffff", 101],
  ["#adadad", 100.1],
  ["#ff0000", 1000],
  ["#00ff00", 100.00001],
  ["#0000ff", 123],
  ["#e4bd40", 45634],
  ["#f1bccd", 6734],
  ["#1de831", 2349],
  ["#fc1a71", 234],
])("Setting lightness to >= 100 returns white (hex = %s, l = %s)", (hex, l) => {
  expect(Color.fromHex(hex).l(l).hex).toBe("#ffffff");
});

test.each([
  ["#000000", 1.21],
  ["#ffffff", 1.567],
  ["#adadad", 10],
  ["#ff0000", 2],
  ["#00ff00", 99],
  ["#0000ff", 99.5],
  ["#e4bd40", 90],
  ["#f1bccd", 89],
  ["#1de831", 50],
  ["#fc1a71", 25.2341],
])(
  "Setting lightness to value in the interval [1.21, 99.5] returns color that's not black or white (hex = %s, l = %s)",
  (hex, l) => {
    expect(["#000000", "#ffffff"]).not.toContain(Color.fromHex(hex).l(l).hex);
  }
);

test.each([
  ["#000000", 100],
  ["#ffffff", 101],
  ["#adadad", 23],
  ["#555555", -76],
  ["#aaaaaa", 50],
  ["#232323", 0],
])(
  "Setting lightness of a grayscale color returns grayscale color (hex = %s, l = %s)",
  (hex, l) => {
    expect(isGrayscale(Color.fromHex(hex).l(l).hex)).toBeTruthy();
  }
);

test.each([
  ["#000000", 12],
  ["#ffffff", -45],
  ["#adadad", 100],
  ["#555555", 10],
  ["#aaaaaa", -123],
  ["#232323", 0],
])(
  "Shifting lightness of a grayscale color returns grayscale color (hex = %s, shift = %s)",
  (hex, shift) => {
    expect(isGrayscale(Color.fromHex(hex).dl(shift).hex)).toBeTruthy();
  }
);

test.each([
  "#000000",
  "#ffffff",
  "#adadad",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#e4bd40",
  "#f1bccd",
  "#1de831",
  "#fc1a71",
])("Shifting lightness by 0 returns the same color (hex = %s)", (hex) => {
  expect(Color.fromHex(hex).dl(0).hex).toBe(hex);
});

test.each([0, 1, 10, 34, 100, 1000, 123123])(
  "Increasing lightness of white returns white (shift = %s)",
  (shift) => {
    expect(Color.fromHex("#ffffff").dl(shift).hex).toBe("#ffffff");
  }
);

test.each([0, -1, -10, -34, -100, -1000, -123123])(
  "Decreasing lightness of black returns black (shift = %s)",
  (shift) => {
    expect(Color.fromHex("#000000").dl(shift).hex).toBe("#000000");
  }
);

test.each([
  ["#a04fbd", -10],
  ["#aaba8f", 12],
  ["#998231", 1],
  ["#ad5776", -20],
  ["#9c6e5d", 15],
  ["#7cc97b", 0],
])(
  "Shifting and then unshifting lightness returns the same color (hex = %s, shift = %s)",
  (hex, shift) => {
    const color = Color.fromHex(hex).dl(shift).dl(-shift);
    expect(color.hex).toBe(hex);
  }
);
