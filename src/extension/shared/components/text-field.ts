import { TextFieldProps, TextField as MuiTextField } from "@mui/material";
import { createStyledComponent } from "theme";
import { typographyOf } from "typography";

export const TextField = createStyledComponent(MuiTextField, {
  name: "TextField",
  label: "TextField",
  slot: "Root"
})<TextFieldProps>(({ theme }) => ({
  "& .MuiInputBase-root": {
    ...typographyOf(theme, "input"),
    padding: "0.5rem 1rem",
    width: "80px",
    height: "50px",
    borderRadius: "0.5rem"
  }
}));
