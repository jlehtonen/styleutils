import { uniqueHashGenerator } from "./hash.js";
import { style } from "@vanilla-extract/css";

const defineVars =
  <T extends Record<string, any>>(vars: T) =>
  (values: Partial<Record<keyof T, any>>) => {
    const varsMap: Record<string, any> = {};
    Object.entries(values).forEach(([key, value]) => {
      const varName = vars[key as keyof T];
      varsMap[varName as any] = value;
    });

    return style({
      vars: varsMap,
    });
  };

export const createVars = <T extends Record<string, any>>(vars: T) => {
  const cssVars = {} as {
    [key in keyof T]: `--${string}`;
  };
  const vals = {} as {
    [key in keyof T]: `var(--${string}, ${string})`;
  };
  Object.entries(vars).forEach(([key, fallback]) => {
    const cssVar: `--${string}` = `--${uniqueHashGenerator.getNextHash()}`;
    cssVars[key as keyof T] = cssVar;
    vals[key as keyof T] = `var(${cssVar}, ${fallback})`;
  });
  return { vars: defineVars(cssVars), vals };
};
