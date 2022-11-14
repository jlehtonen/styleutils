import { hexFromOkhsl, okhslFromHex } from "./okhsl/convert";

export class Color {
  private readonly _h: number;
  private readonly _s: number;
  private readonly _l: number;

  constructor(h: number, s: number, l: number) {
    if (s === 0) {
      this._h = 0;
      this._s = 0;
      this._l = l;
    } else if (l === 0) {
      this._h = 0;
      this._s = 0;
      this._l = 0;
    } else if (l === 1) {
      this._h = 0;
      this._s = 0;
      this._l = 1;
    } else {
      this._h = h;
      this._s = this.clamp(0, s, 1);
      this._l = this.clamp(0, l, 1);
    }
  }

  get hex(): string {
    const okhsl = { h: this._h, s: this._s, l: this._l };
    const hex = hexFromOkhsl(okhsl);
    if (hex === undefined) {
      throw new Error(`Invalid color: ${JSON.stringify(okhsl)}`);
    }
    return hex;
  }

  static fromHex(hex: string) {
    const okhsl = okhslFromHex(hex);
    if (okhsl === undefined) {
      throw new Error(`Invalid color: ${hex}`);
    }
    if (Color.isGrayscale(hex)) {
      return new Color(0, 0, okhsl.l);
    }
    return new Color(okhsl.h, okhsl.s, okhsl.l);
  }

  h(h: number) {
    return new Color(h / 100, this._s, this._l);
  }

  s(s: number) {
    if (this._s === 0) {
      return this;
    }
    return new Color(this._h, this.clamp(0, s, 100) / 100, this._l);
  }

  l(l: number) {
    return new Color(this._h, this._s, this.clamp(0, l, 100) / 100);
  }

  dh(dh: number) {
    return this.h(this._h * 100 + dh);
  }

  ds(ds: number) {
    return this.s(this._s * 100 + ds);
  }

  dl(dl: number) {
    return this.l(this._l * 100 + dl);
  }

  dsp(dsp: number) {
    const ds = (this._s * dsp) / 100;
    return new Color(this._h, this._s + ds, this._l);
  }

  dlp(dlp: number) {
    const dl = (this._l * dlp) / 100;
    return new Color(this._h, this._s, this._l + dl);
  }

  private clamp(low: number, value: number, high: number) {
    return Math.min(Math.max(value, low), high);
  }

  private static isGrayscale = (hex: string) => {
    if (hex.length === 4) {
      return hex[1] === hex[2] && hex[2] === hex[3];
    }

    if (hex.length === 7) {
      const r = hex.slice(1, 3);
      const g = hex.slice(3, 5);
      const b = hex.slice(5, 7);
      return r === g && g === b;
    }

    throw new Error(`Invalid hex: ${hex}`);
  };
}
