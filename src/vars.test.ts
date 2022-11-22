import { _Vars } from "./vars.js";

test.each([
  [{}, undefined, { vars: {}, vals: {} }],
  [
    { color: "red" },
    undefined,
    { vars: { color: "--a" }, vals: { color: "var(--a, red)" } },
  ],
  [
    { var1: "asd", another: 123 },
    undefined,
    {
      vars: { var1: "--a", another: "--b" },
      vals: { var1: "var(--a, asd)", another: "var(--b, 123)" },
    },
  ],
  [
    { color: "red" },
    "asd",
    { vars: { color: "--asd_a" }, vals: { color: "var(--asd_a, red)" } },
  ],
  [
    { asd: "red" },
    "qwe",
    { vars: { asd: "--qwe_a" }, vals: { asd: "var(--qwe_a, red)" } },
  ],
])(
  "createVarsAndVals returns correct value (input = %s, output = %s)",
  (input, prefix, output) => {
    const _vars = new _Vars(prefix);
    expect(_vars.createVarsAndVals(input)).toEqual(output);
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
    const _vars = new _Vars();
    expect(_vars.createStyleObjects(vars, values)).toEqual(output);
  }
);

test.each([
  [{}, undefined, { name: "--a", value: "var(--a)" }],
  [{ name: "asd" }, undefined, { name: "--asd", value: "var(--asd)" }],
  [
    { name: "asd", fallback: 123 },
    undefined,
    { name: "--asd", value: "var(--asd, 123)" },
  ],
  [{ fallback: 123 }, undefined, { name: "--a", value: "var(--a, 123)" }],
  [{}, "asd", { name: "--asd_a", value: "var(--asd_a)" }],
  [{ name: "asd" }, "qwe", { name: "--qwe_asd", value: "var(--qwe_asd)" }],
  [{ fallback: 12 }, "qwe", { name: "--qwe_a", value: "var(--qwe_a, 12)" }],
])(
  "create returns correct value (input = %s, prefix = %s, output = %s)",
  (input, prefix, output) => {
    const _vars = new _Vars(prefix);
    expect(_vars.create(input)).toEqual(output);
  }
);
