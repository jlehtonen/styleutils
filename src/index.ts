export { createVars, createVar, CreateVarOptions } from "./vars.js";
export { GlobalCss, globalStyles, SelectorMap, selector } from "./style.js";

import { createTheme as createVanillaTheme } from "@vanilla-extract/css";

export const createTheme = createVanillaTheme;

export { reset } from "./reset.js";

export { style } from "@vanilla-extract/css";
export { recipe } from "@vanilla-extract/recipes";

export {
  ShadowGeneratorOptions,
  ShadowOptions,
  generateShadows,
  shadows,
} from "./properties/index.js";

export { cls } from "./util.js";
