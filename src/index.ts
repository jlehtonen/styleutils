export {
  Color,
  css as cssColors,
  radix as radixColors,
  tailwind as tailwindColors,
} from "./color/index.js";

export { createVars } from "./vars.js";
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
