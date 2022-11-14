import { globalStyles } from "./style";

export const reset = (rootSelector: string | null = null) => {
  globalStyles({
    ":root": {
      fontSize: "1rem",
      lineHeight: 1.5,
      fontFamily: "'Open Sans', sans-serif",
    },

    "*, *::before, *::after": {
      boxSizing: "border-box",
      margin: 0,
      overflowWrap: "break-word",
    },

    "html, body": {
      height: "100%",
    },

    body: {
      WebkitFontSmoothing: "antialiased",
    },

    "img, picture, video, canvas, svg": {
      display: "block",
      maxWidth: "100%",
    },

    "input, button, textarea, select": {
      font: "inherit",
    },
  });

  if (rootSelector !== null) {
    globalStyles({
      [rootSelector]: {
        height: "100%",
        isolation: "isolate",
      },
    });
  }
};
