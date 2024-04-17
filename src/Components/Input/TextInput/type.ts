import * as GlobalStyleTypes from "../../../Types/style";


export type T_TextVerification = RegExp | ((value : string) => boolean);


export type T_LabelStyle_Normal =
{
    side              ?: "start" | "end";
    paddingVertical   ?: GlobalStyleTypes.T_Size_Absolute;
    paddingHorizontal ?: GlobalStyleTypes.T_Size_Absolute;
    color             ?: GlobalStyleTypes.T_Color;
    fontSize          ?: GlobalStyleTypes.T_Size_Absolute;
    fontWeight        ?: GlobalStyleTypes.T_FontWeight;
}

export type T_LabelStyle =
{
    normal  ?: T_LabelStyle_Normal;
    hover   ?: Omit<T_LabelStyle_Normal, "side" | "paddingVertical" | "paddingHorizontal">;
    focus   ?: Omit<T_LabelStyle_Normal, "side" | "paddingVertical" | "paddingHorizontal">;
    invalid ?:
    {
        normal ?: Omit<T_LabelStyle_Normal, "side" | "paddingVertical" | "paddingHorizontal">;
        hover  ?: Omit<T_LabelStyle_Normal, "side" | "paddingVertical" | "paddingHorizontal">;
        focus  ?: Omit<T_LabelStyle_Normal, "side" | "paddingVertical" | "paddingHorizontal">;
    };
};


export type T_InputStyle_Normal =
{
    paddingVertical   ?: GlobalStyleTypes.T_Size_Absolute;
    paddingHorizontal ?: GlobalStyleTypes.T_Size_Absolute;
    color             ?: GlobalStyleTypes.T_Color;
    fontSize          ?: GlobalStyleTypes.T_Size_Absolute;
    fontWeight        ?: GlobalStyleTypes.T_FontWeight;
    borderColor       ?: GlobalStyleTypes.T_Color;
    borderWidth       ?: GlobalStyleTypes.T_Size_Absolute;
    borderRadius      ?: GlobalStyleTypes.T_Size_Absolute;
    background        ?: GlobalStyleTypes.T_Color;
};     

export type T_InputStyle =
{
    normal  ?: T_InputStyle_Normal;
    hover   ?: Omit<T_InputStyle_Normal, "paddingVertical" | "paddingHorizontal" | "borderRadius">;
    focus   ?: Omit<T_InputStyle_Normal, "paddingVertical" | "paddingHorizontal" | "borderRadius">;
    invalid ?:
    {
        normal ?: Omit<T_InputStyle_Normal, "paddingVertical" | "paddingHorizontal" | "borderRadius">;
        hover  ?: Omit<T_InputStyle_Normal, "paddingVertical" | "paddingHorizontal" | "borderRadius">;
        focus  ?: Omit<T_InputStyle_Normal, "paddingVertical" | "paddingHorizontal" | "borderRadius">;
    };
};


export type T_CaretStyle_Normal =
{
    color ?: GlobalStyleTypes.T_Color;
};

export type T_CaretStyle =
{
    normal  ?: T_CaretStyle_Normal;
    hover   ?: T_CaretStyle_Normal;
    focus   ?: T_CaretStyle_Normal;
    invalid ?:
    {
        normal ?: T_CaretStyle_Normal;
        hover  ?: T_CaretStyle_Normal;
        focus  ?: T_CaretStyle_Normal;
    };
};


export type T_ErrorMessageStyle_Normal =
{
    paddingVertical   ?: GlobalStyleTypes.T_Size_Absolute; 
    paddingHorizontal ?: GlobalStyleTypes.T_Size_Absolute;
    color             ?: GlobalStyleTypes.T_Color;
    fontSize          ?: GlobalStyleTypes.T_Size_Absolute;
    fontWeight        ?: GlobalStyleTypes.T_FontWeight;
};

export type T_ErrorMessageStyle =
{
    normal ?: T_ErrorMessageStyle_Normal;
    hover  ?: Omit<T_ErrorMessageStyle_Normal, "paddingVertical" | "paddingHorizontal">;
    focus  ?: Omit<T_ErrorMessageStyle_Normal, "paddingVertical" | "paddingHorizontal">;
};

export type T_Style =
{
    label        ?: T_LabelStyle;
    input        ?: T_InputStyle;
    caret        ?: T_CaretStyle;
    errorMessage ?: T_ErrorMessageStyle;
};


export type T_Props =
{
    type          : "text" | "password";
    placeholder  ?: string;
    onChange     ?: (newValue : string | null) => void;
    icon         ?: JSX.Element;
    label        ?: string;
    errorMessage ?: string;
    isValid      ?: boolean;
    style        ?: T_Style;
};
