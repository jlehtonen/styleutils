export interface Shadow {
  x?: string;
  y?: string;
  blur?: string;
  spread?: string;
  color?: string;
}

export const shadow = (...shadows: Shadow[]) => {
  return shadows
    .map(
      (s) =>
        `${s.x ?? "0"} ${s.y ?? "0"} ${s.blur ?? "0"} ${s.spread ?? "0"} ${
          s.color ?? "black"
        }`
    )
    .join(", ");
};
