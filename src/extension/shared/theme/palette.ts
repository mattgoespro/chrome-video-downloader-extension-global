import { PaletteOptions } from "@mui/material";

export const palette = (): PaletteOptions => {
  const grey = {
    "50": "#fafafa",
    "100": "#f5f5f5",
    "200": "#eeeeee",
    "300": "#e0e0e0",
    "400": "#bdbdbd",
    "500": "#9e9e9e",
    "600": "#757575",
    "700": "#616161",
    "800": "#424242",
    "900": "#212121"
  };

  return {
    mode: "light",
    text: {
      primary: grey["900"],
      secondary: "#6b7280",
      disabled: grey["500"]
    },
    primary: {
      main: "#388e3c"
    },
    secondary: {
      main: "#0091ea"
    },
    info: {
      main: "#81c784"
    },
    success: {
      main: "#7cb342"
    },
    background: {
      paper: grey["100"],
      lightGrey: grey["200"],
      grey: grey["400"],
      dark: grey["700"]
    }
  };
};
