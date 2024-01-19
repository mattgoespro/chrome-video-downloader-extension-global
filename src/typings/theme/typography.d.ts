declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    label: true;
  }
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    label: React.CSSProperties;
    select: React.CSSProperties;
    input: React.CSSProperties;
    caption?: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    label?: React.CSSProperties;
    select?: React.CSSProperties;
    input?: React.CSSProperties;
    caption?: React.CSSProperties;
  }

  interface TypeBackground {
    grey: string;
    lightGrey: string;
    dark: string;
  }
}

export {};
