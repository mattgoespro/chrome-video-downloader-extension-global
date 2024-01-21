import { Theme, ThemeOptions } from "@mui/material";
import { CSSProperties } from "@mui/styled-engine-sc";

export const typographyOf = (theme: Theme, element: keyof Theme["typography"]) => {
  return theme.typography[element] as CSSProperties;
};

export const typography: ThemeOptions["typography"] = (palette) => ({
  h1: {
    fontFamily: '"Source Code Pro", "Helvetica", "Arial", sans-serif',
    color: palette.text.primary,
    fontSize: "3rem",
    textAlign: "center"
  },
  label: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: "1rem",
    textAlign: "center"
  },
  body1: {
    fontFamily: '"Nunito", "Helvetica", "Arial", sans-serif',
    fontSize: "1rem"
  },
  body2: {
    fontFamily: '"Nunito", "Helvetica", "Arial", sans-serif'
  },
  button: {
    fontFamily: '"Nunito", "Helvetica", "Arial", sans-serif',
    fontSize: "1rem",
    textAlign: "center"
  },
  input: {
    fontFamily: '"Nunito", "Helvetica", "Arial", sans-serif',
    fontSize: "1rem",
    textAlign: "center"
  },
  caption: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: "1rem",
    fontWeight: 200,
    color: palette.grey[700],
    textAlign: "center"
  }
});
