import { Container, ContainerProps, TypeBackground } from "@mui/material";
import { StandardLonghandProperties } from "csstype";
import { createStyledComponent } from "theme";

export type FlexContainerProps = ContainerProps & {
  flexDirection?: "row" | "column";
  justifyContent?: StandardLonghandProperties["justifyContent"];
  alignItems?: StandardLonghandProperties["alignItems"];
  gap?: number;
  backgroundColor?: keyof TypeBackground;
  padTopBottom?: boolean | number;
  padSides?: boolean | number;
  flexWeight?: number;
};

export const FlexContainer = createStyledComponent(Container, {
  name: "FlexContainer",
  label: "FlexContainer",
  slot: "Root",
  shouldForwardProp(propName: keyof FlexContainerProps) {
    return (
      propName !== "flexDirection" &&
      propName !== "justifyContent" &&
      propName !== "alignItems" &&
      propName !== "backgroundColor" &&
      propName !== "padTopBottom" &&
      propName !== "padSides" &&
      propName !== "flexWeight" &&
      propName !== "gap"
    );
  }
})<FlexContainerProps>((options) => {
  const {
    theme,
    flexDirection,
    justifyContent,
    alignItems,
    gap,
    backgroundColor,
    padTopBottom,
    padSides,
    flexWeight
  } = options;

  const sidePadding = padSides != null ? (typeof padSides === "boolean" ? 1 : padSides) : 1;
  const topBottomPadding =
    padTopBottom != null ? (typeof padTopBottom === "boolean" ? 1 : padTopBottom) : 1;

  return {
    ".MuiContainer-root": {
      padding: theme.spacing(topBottomPadding, sidePadding)
    },
    display: "flex",
    flex: flexWeight,
    flexDirection,
    justifyContent,
    alignItems,
    backgroundColor: theme.palette.background[backgroundColor],
    width: "100%",
    height: "100%",
    gap: theme.spacing(gap ?? 1)
  };
});
