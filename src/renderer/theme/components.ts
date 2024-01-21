import { Theme } from "@mui/material";

export const components: Theme["components"] = {
  MuiButton: {
    variants: [
      {
        props: { variant: "link" },
        style: {
          color: "inherit",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline"
          }
        }
      },
      {
        props: { variant: "icon" },
        style: {
          minWidth: "auto",
          padding: 0
        }
      }
    ]
  }
};
