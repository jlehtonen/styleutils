import { globalStyle, GlobalStyleRule } from "@vanilla-extract/css";
import { StyleWithSelectors } from "@vanilla-extract/css/dist/declarations/src/types";

export type GlobalCss = Record<string, GlobalStyleRule>;

export const globalStyles = (rules: GlobalCss) => {
  Object.entries(rules).forEach(([selector, rule]) => {
    globalStyle(selector, rule);
  });
};

export type SelectorMap = { selectors: { [selector: string]: GlobalStyleRule } };

const data =
  (name: string) =>
  (value: string | null = null) =>
  (...rules: GlobalStyleRule[]): SelectorMap => ({
    selectors: {
      [getDataSelector(name, value)]: combine(...rules),
    },
  });

const getDataSelector = (name: string, value: string | null = null) => {
  if (value === null) {
    return `&[data-${name}]`;
  }

  return `&[data-${name}='${value}']`;
};

const combine = <T extends object>(...args: T[]): T => {
  let result = {} as T;
  for (const arg of args) {
    result = { ...result, ...arg };
  }
  return result;
};

const screen =
  (minWidth: string) =>
  (...rules: StyleWithSelectors[]) => {
    return {
      "@media": {
        [`screen and (min-width: ${minWidth})`]: combine(...rules),
      },
    };
  };

export const selector = {
  data,
  screen,
};
