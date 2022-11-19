import { Color } from "@jlehtonen/color";

export interface ShadowOptions {
  x?: string | number;
  y?: string | number;
  blur?: string | number;
  spread?: string | number;
  color?: string;
  inset?: boolean;
}

export const formatShadowLengthValue = (value: string | number) => {
  if (value === 0) {
    return "0";
  }
  if (typeof value === "number") {
    return `${value}px`;
  }
  return value;
};

export const shadow = (shadow: ShadowOptions) => {
  const x = formatShadowLengthValue(shadow.x ?? 0);
  const y = formatShadowLengthValue(shadow.y ?? 0);
  const blur = formatShadowLengthValue(shadow.blur ?? 0);
  const spread = formatShadowLengthValue(shadow.spread ?? 0);
  const color = shadow.color ?? "currentcolor";

  let output = `${x} ${y}`;

  if (spread !== "0") {
    output = `${output} ${blur} ${spread}`;
  } else if (blur !== "0") {
    output = `${output} ${blur}`;
  }

  if (color.toLowerCase() !== "currentcolor") {
    output = `${output} ${color}`;
  }

  if (shadow.inset) {
    output = `${output} inset`;
  }

  return output;
};

export const shadows = (...shadows: ShadowOptions[]) => {
  return shadows.map(shadow).join(", ");
};

export interface ShadowGeneratorOptions {
  color: (index: number, n: number) => Color | string;
  x: (index: number, n: number) => number;
  y: (index: number, n: number) => number;
  blur: (index: number, n: number) => number;
  spread: (index: number, n: number) => number;
  inset: boolean;
}

const defaultShadowGeneratorOptions: ShadowGeneratorOptions = {
  color: (index, n) => new Color(0, 0, 0, 30 / n),
  x: () => 0,
  y: (index) => 2 ** index,
  blur: (index) => 2 ** index,
  spread: () => 0,
  inset: false,
};

export const generateShadows = (
  n: number,
  options?: Partial<ShadowGeneratorOptions>
) => {
  const { x, y, blur, spread, color, inset } = {
    ...defaultShadowGeneratorOptions,
    ...options,
  };
  const shadowList: ShadowOptions[] = [];
  for (let i = 0; i < n; i++) {
    const c = color(i, n);
    shadowList.push({
      x: x(i, n),
      y: y(i, n),
      blur: blur(i, n),
      spread: spread(i, n),
      color: typeof c === "string" ? c : c.hex,
      inset,
    });
  }
  return shadows(...shadowList);
};
