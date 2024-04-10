import * as StyleTypes from "../../Types/style";


export type T_ActiveButtonStyle   = Omit<T_NormalButtonStyle, "borderRadius" | "paddingHorizontal" | "paddingVertical">;
export type T_HoverButtonStyle    = Omit<T_NormalButtonStyle, "borderRadius" | "paddingHorizontal" | "paddingVertical">;
export type T_DisabledButtonStyle = Omit<T_NormalButtonStyle, "borderRadius" | "paddingHorizontal" | "paddingVertical">;
export type T_NormalButtonStyle   =
{
    paddingHorizontal ?: StyleTypes.T_Size_Absolute;
    paddingVertical   ?: StyleTypes.T_Size_Absolute;
    color             ?: StyleTypes.T_Color;
    background        ?: StyleTypes.T_Color;
    borderRadius      ?: StyleTypes.T_Size_Absolute;
    fontSize          ?: StyleTypes.T_Size_Absolute;
    fontWeight        ?: StyleTypes.T_FontWeight;
};

export type T_Style =
{
    normal   ?: T_NormalButtonStyle;
    hover    ?: T_HoverButtonStyle;
    active   ?: T_ActiveButtonStyle;
    disabled ?:
    {
        normal ?: T_DisabledButtonStyle;
        hover  ?: T_HoverButtonStyle;
        active ?: T_ActiveButtonStyle;
    };
};

export type T_Props =
{
    children  : string | JSX.Element;
    disabled ?: boolean;
    onClick  ?: () => void;
    style    ?: T_Style;
};
