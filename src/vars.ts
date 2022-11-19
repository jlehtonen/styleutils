import { nextHash } from "./hash.js";
import { style } from "@vanilla-extract/css";
import { selector } from "./style.js";

export type SimpleVarValue = string | number;
export type ComplexVarValue = Record<string, SimpleVarValue>;
export type VarValue = SimpleVarValue | ComplexVarValue;

export interface CreateVarOptions {
  name?: string;
  fallback?: string | number;
}

export const createVar = (options?: CreateVarOptions) => {
  const name = `--${options?.name !== undefined ? options.name : nextHash()}`;
  const fallback = options?.fallback;
  return { name, value: fallback ? `var(${name}, ${fallback})` : `var(${name})` };
};

const getSimpleVarStyleObject = (varName: string, value: SimpleVarValue) => {
  return { vars: { [varName]: value.toString() } };
};

const getComplexVarStyleObjects = (varName: string, complexValue: ComplexVarValue) => {
  return Object.entries(complexValue).map(([minWidth, value]) => {
    const simpleStyleObject = getSimpleVarStyleObject(varName, value);
    return minWidth === "base"
      ? simpleStyleObject
      : selector.screen(minWidth)(simpleStyleObject);
  });
};

export const createVarsAndVals = <T extends Record<string, SimpleVarValue>>(
  vars: T
) => {
  type Key = keyof T;
  const cssVars = {} as { [key in Key]: string };
  const vals = {} as { [key in Key]: string };

  Object.entries(vars).forEach(([key, fallback]) => {
    const { name, value } = createVar({ fallback });
    cssVars[key as Key] = name;
    vals[key as Key] = value;
  });

  return { vars: cssVars, vals };
};

export const createStyleObjects = <T extends Record<string, SimpleVarValue>>(
  vars: { [key in keyof T]: string },
  values: Partial<Record<keyof T, VarValue>>
) => {
  const styleObjects: any[] = [];

  Object.entries(values).forEach(([key, value]) => {
    const varName = vars[key as keyof T];
    if (typeof value === "string" || typeof value === "number") {
      styleObjects.push(getSimpleVarStyleObject(varName, value));
    } else {
      styleObjects.push(
        ...getComplexVarStyleObjects(varName, value as ComplexVarValue)
      );
    }
  });

  return styleObjects;
};

export const createVars = <T extends Record<string, SimpleVarValue>>(vars: T) => {
  const { vars: cssVars, vals } = createVarsAndVals(vars);

  return {
    vars: (values: Partial<Record<keyof T, VarValue>>) =>
      style(createStyleObjects(cssVars, values)),
    vals,
  };
};
