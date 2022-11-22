import { createStyleObjects, createVarsAndVals, createVar } from "./vars.js";

test.each([
  [{}, { vars: {}, vals: {} }],
  [{ color: "red" }, { vars: { color: "--a" }, vals: { color: "var(--a, red)" } }],
  [
    { var1: "asd", another: 123 },
    {
      vars: { var1: "--b", another: "--c" },
      vals: { var1: "var(--b, asd)", another: "var(--c, 123)" },
    },
  ],
])(
  "createVarsAndVals returns correct value (input = %s, output = %s)",
  (input, output) => {
    expect(createVarsAndVals(input)).toEqual(output);
  }
);

test.each([
  [{}, {}, []],
  [{ asd: "--a" }, { asd: "1rem" }, [{ vars: { "--a": "1rem" } }]],
  [
    { asd: "--a" },
    { asd: { "640px": "2rem" } },
    [
      {
        "@media": {
          "screen and (min-width: 640px)": { vars: { "--a": "2rem" } },
        },
      },
    ],
  ],
  [
    { asd: "--a", qwe: "--b" },
    { asd: { base: "1rem", "640px": "2rem" }, qwe: "3rem" },
    [
      { vars: { "--a": "1rem" } },
      {
        "@media": {
          "screen and (min-width: 640px)": { vars: { "--a": "2rem" } },
        },
      },
      { vars: { "--b": "3rem" } },
    ],
  ],
])(
  "createStyleObjects returns correct value (vars = %s, values = %s, output = %s)",
  (vars, values, output) => {
    expect(createStyleObjects(vars, values)).toEqual(output);
  }
);

test.each([
  [{}, { name: "--d", value: "var(--d)" }],
  [{ name: "asd" }, { name: "--asd", value: "var(--asd)" }],
  [
    { name: "asd", fallback: 123 },
    { name: "--asd", value: "var(--asd, 123)" },
  ],
  [{ fallback: 123 }, { name: "--e", value: "var(--e, 123)" }],
  [{ prefix: "asd" }, { name: "--asd_f", value: "var(--asd_f)" }],
  [
    { prefix: "qwe", name: "asd" },
    { name: "--qwe_asd", value: "var(--qwe_asd)" },
  ],
  [
    { prefix: "qwe", fallback: 12 },
    { name: "--qwe_g", value: "var(--qwe_g, 12)" },
  ],
])("createVar returns correct value (input = %s, output = %s)", (input, output) => {
  expect(createVar(input)).toEqual(output);
});

test.each([
  [
    { color: "red" },
    "asd",
    { vars: { color: "--asd_h" }, vals: { color: "var(--asd_h, red)" } },
  ],
  [
    { asd: "red" },
    "qwe",
    { vars: { asd: "--qwe_i" }, vals: { asd: "var(--qwe_i, red)" } },
  ],
])(
  "createVarsAndVals returns correct value when using prefix (input = %s, prefix = %s, output = %s)",
  (input, prefix, output) => {
    expect(createVarsAndVals(input, prefix)).toEqual(output);
  }
);
