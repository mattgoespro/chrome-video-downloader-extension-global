import { Theme, createTheme } from "@mui/material/styles";
import { createStyled } from "@mui/system";
import { SpacingArgument } from "@mui/system/createTheme/createSpacing";
import { components } from "./components";
import { palette } from "./palette";
import { typography } from "./typography";

export const theme: Theme = createTheme({
  palette: palette(),
  components,
  typography,
  spacing: (...args: SpacingArgument[]): string => {
    if (args.length === 0) {
      return "0rem";
    }

    return args.map((value) => (value == null ? "0rem" : `${value}rem`)).join();
  },
  shape: {
    borderRadius: 4
  }
});

export const createStyledComponent = createStyled({
  defaultTheme: theme
});
