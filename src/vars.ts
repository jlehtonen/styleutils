import { uniqueHashGenerator } from "./hash.js";
import { style } from "@vanilla-extract/css";
import { selector } from "./style.js";

type VarValue = string | number | Record<string, string | number>;

const defineVars =
  <T extends Record<string, string | number>>(vars: T) =>
  (values: Partial<Record<keyof T, VarValue>>) => {
    const styleObjects: any[] = [];
    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }
      const varName = vars[key as keyof T];
      if (typeof value === "string" || typeof value === "number") {
        styleObjects.push({ vars: { [varName]: value } });
      } else {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subKey === "base") {
            return styleObjects.push({ vars: { [varName]: subValue } });
          }
          styleObjects.push(
            selector.screen(subKey)({
              vars: {
                [varName]: subValue.toString(),
              },
            })
          );
        });
      }
    });

    return style(styleObjects);
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
