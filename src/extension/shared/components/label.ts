import { FormLabel, FormLabelBaseProps } from "@mui/material";
import { createStyledComponent } from "theme";

type LabelProps = FormLabelBaseProps & {
  tooltip?: string;
};

export const Label = createStyledComponent(FormLabel, {
  name: "Label",
  slot: "Root",
  shouldForwardProp(propName) {
    return propName !== "tooltip";
  }
})<LabelProps>(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: theme.typography.label.fontSize,
  fontWeight: theme.typography.body1.fontWeight,
  lineHeight: theme.typography.body1.lineHeight,
  letterSpacing: theme.typography.body1.letterSpacing,
  fontFamily: theme.typography.body1.fontFamily,
  margin: theme.spacing(0.5),
  padding: 0,
  textOverflow: "ellipsis"
})) as typeof FormLabel;
