export type T_CssPropertiesValues = string | number | undefined;
export type T_CssCustomProperties = { [cssCustomProperty : `--${string}`]: T_CssPropertiesValues };
