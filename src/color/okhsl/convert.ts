import { okhslToSrgb, srgbToOkhsl } from "./okhsl";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface Okhsl {
  h: number;
  s: number;
  l: number;
}

export const okhslFromHex = (hex: string): Okhsl | undefined => {
  const rgb = rgbFromHex(hex);
  if (rgb === undefined) {
    return undefined;
  }
  if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0) {
    return { h: 0, s: 1, l: 0 };
  }
  return okhslFromRgb(rgb);
};

export const hexFromOkhsl = (okhsl: Okhsl): string | undefined => {
  const rgb = rgbFromOkhsl(okhsl);
  if (rgb === undefined) {
    return undefined;
  }
  return hexFromRgb(rgb);
};

const rgbFromHex = (hex: string): RGB | undefined => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : undefined;
};

const okhslFromRgb = ({ r, g, b }: RGB): Okhsl | undefined => {
  const [h, s, l] = srgbToOkhsl(r, g, b);
  if (isNaN(h) || isNaN(s) || isNaN(l)) {
    return undefined;
  }
  return { h, s, l };
};

const rgbFromOkhsl = ({ h, s, l }: Okhsl): RGB | undefined => {
  const [r, g, b] = okhslToSrgb(h, s, l);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return undefined;
  }
  return { r, g, b };
};

const hexFromRgb = ({ r, g, b }: RGB): string => {
  const r8 = Math.max(Math.min(Math.round(r), 255), 0);
  const g8 = Math.max(Math.min(Math.round(g), 255), 0);
  const b8 = Math.max(Math.min(Math.round(b), 255), 0);
  return "#" + ((1 << 24) + (r8 << 16) + (g8 << 8) + b8).toString(16).slice(1);
};
