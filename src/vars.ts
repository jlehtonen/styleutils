import { style } from "@vanilla-extract/css";
import { UniqueHashGenerator } from "./hash.js";
import { selector } from "./style.js";

export type SimpleVarValue = string | number;
export type ComplexVarValue = Record<string, SimpleVarValue>;
export type VarValue = SimpleVarValue | ComplexVarValue;

export interface CreateOptions {
  name?: string;
  fallback?: string | number;
}

export class _Vars {
  private readonly prefix?: string;
  private readonly hashGenerator = new UniqueHashGenerator();

  constructor(prefix?: string) {
    this.prefix = prefix;
  }

  create(options?: CreateOptions) {
    const name = `--${this.getPrefix()}${this.getBaseName(options?.name)}`;
    const fallback = options?.fallback;
    return { name, value: fallback ? `var(${name}, ${fallback})` : `var(${name})` };
  }

  createMany<T extends Record<string, SimpleVarValue>>(vars: T) {
    const { vars: cssVars, vals } = this.createVarsAndVals(vars);

    return {
      vars: (values: Partial<Record<keyof T, VarValue>>) =>
        style(this.createStyleObjects(cssVars, values)),
      vals,
    };
  }

  createVarsAndVals<T extends Record<string, SimpleVarValue>>(vars: T) {
    type Key = keyof T;
    const cssVars = {} as { [key in Key]: string };
    const vals = {} as { [key in Key]: string };

    Object.entries(vars).forEach(([key, fallback]) => {
      const { name, value } = this.create({ fallback });
      cssVars[key as Key] = name;
      vals[key as Key] = value;
    });

    return { vars: cssVars, vals };
  }

  createStyleObjects<T extends Record<string, SimpleVarValue>>(
    vars: { [key in keyof T]: string },
    values: Partial<Record<keyof T, VarValue>>
  ) {
    const styleObjects: any[] = [];

    Object.entries(values).forEach(([key, value]) => {
      const varName = vars[key as keyof T];
      if (typeof value === "string" || typeof value === "number") {
        styleObjects.push(this.getSimpleVarStyleObject(varName, value));
      } else {
        styleObjects.push(
          ...this.getComplexVarStyleObjects(varName, value as ComplexVarValue)
        );
      }
    });

    return styleObjects;
  }

  private getPrefix() {
    return this.prefix !== undefined ? `${this.prefix}_` : "";
  }

  private getBaseName(name?: string) {
    return name !== undefined ? name : this.hashGenerator.getNextHash();
  }

  private getSimpleVarStyleObject(varName: string, value: SimpleVarValue) {
    return { vars: { [varName]: value.toString() } };
  }

  private getComplexVarStyleObjects(varName: string, complexValue: ComplexVarValue) {
    return Object.entries(complexValue).map(([minWidth, value]) => {
      const simpleStyleObject = this.getSimpleVarStyleObject(varName, value);
      return minWidth === "base"
        ? simpleStyleObject
        : { "@media": selector.screen(minWidth)(simpleStyleObject) };
    });
  }
}

export class Vars {
  private readonly _vars: _Vars;

  constructor(prefix?: string) {
    this._vars = new _Vars(prefix);
  }

  create(options?: CreateOptions) {
    return this._vars.create(options);
  }

  createMany<T extends Record<string, SimpleVarValue>>(vars: T) {
    return this._vars.createMany(vars);
  }
}
