export const cls = (...classes: (string | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");
