export {
  Color,
  css as cssColors,
  radix as radixColors,
  tailwind as tailwindColors,
} from "./color/index.js";

export { createVars } from "./vars.js";
export { style, GlobalCss, globalStyles, SelectorMap, selector } from "./style.js";

import { createTheme as createVanillaTheme } from "@vanilla-extract/css";

export const createTheme = createVanillaTheme;

export { reset } from "./reset.js";

export { recipe } from "@vanilla-extract/recipes";

export { Shadow, shadow } from "./properties/index.js";
