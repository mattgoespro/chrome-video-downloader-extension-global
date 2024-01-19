import { Theme } from "@mui/material";
import { ComponentsOverrides, ComponentsProps, ComponentsVariants } from "@mui/material/styles";
import { CaptionProps } from "components/caption";

declare module "@mui/material/styles" {
  interface Components {
    Heading?: React.HTMLAttributes<"h1">;
    Subheading?: React.HTMLAttributes<"h2">;
    FlexContainer?: {
      defaultProps?: ComponentsProps["MuiContainer"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiContainer"];
      variants?: ComponentsVariants["MuiContainer"];
    };
    Caption?: CaptionProps;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    link: true;
    icon: true;
  }
}

export {};
