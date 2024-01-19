import Typography, { TypographyProps } from "@mui/material/Typography";
import { createStyledComponent } from "theme";
import { typographyOf } from "typography";

export type CaptionProps = TypographyProps & {
  size?: "small" | "medium" | "large";
};

function fontSize(size: CaptionProps["size"]) {
  return size === "small" ? "0.75rem" : size === "large" ? "1.25rem" : "1rem";
}

export const Caption = createStyledComponent(Typography, {
  name: "Caption",
  label: "Caption",
  slot: "Root",
  shouldForwardProp(propName: keyof CaptionProps) {
    return propName !== "size";
  }
})<CaptionProps>(({ theme, size }) => ({
  ...typographyOf(theme, "caption"),
  fontSize: fontSize(size)
}));
