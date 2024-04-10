export type T_CssPropertiesValues = string | number | undefined;
export type T_CssCustomProperties = { [cssCustomProperty : `--${string}`]: T_CssPropertiesValues };


export type T_Horizontal  = "left" | "right";
export type T_Vertical    = "top"  | "bottom";
export type T_Position    = T_Horizontal | T_Vertical;


export type T_Size_Fit_Content = "fit-content";

export type T_Size_Absolute_Unit =
    | "cm" // Centimeters
    | "mm" // Millimeters
    | "in" // Inches
    | "px" // Pixels
    | "pt" // Points
    | "pc" // Picas

export type T_Size_Relative_Unit =
    | "%" //Percentage (of the containing block's width)

export type T_Size_Viewport_Unit =
    | "vw"   // 1% of the viewport's width
    | "vh"   // 1% of the viewport's height
    | "vmin" // 1% of the smaller of the viewport's width or height
    | "vmax" // 1% of the larger of the viewport's width or height

export type T_Size_FontRelative_Unit =
    | "em" // Relative to the font-size of the element
    | "ex" // Relative to the x-height of the current font
    | "ch" // Relative to the width of the "0" (zero) glyph in the element's font

export type T_Size_Flexible_Unit =
    | "fr" // Fraction unit (used in Grid Layout and Flexbox)

export type T_Size_Other_Unit =
    | "rem" // Relative to the font-size of the root element
    | "lh"  // Relative to the line-height of the element

export type T_Size_Unit =
    | T_Size_Absolute_Unit
    | T_Size_Relative_Unit
    | T_Size_Viewport_Unit
    | T_Size_FontRelative_Unit
    | T_Size_Flexible_Unit
    | T_Size_Other_Unit
;

export type T_Size_Absolute     = `${number}${T_Size_Absolute_Unit    }`;
export type T_Size_Relative     = `${number}${T_Size_Relative_Unit    }`;
export type T_Size_Viewport     = `${number}${T_Size_Viewport_Unit    }`;
export type T_Size_FontRelative = `${number}${T_Size_FontRelative_Unit}`;
export type T_Size_Flexible     = `${number}${T_Size_Flexible_Unit    }`;
export type T_Size_Other        = `${number}${T_Size_Other_Unit       }`;
export type T_Size =
    | T_Size_Absolute    
    | T_Size_Relative    
    | T_Size_Viewport    
    | T_Size_FontRelative
    | T_Size_Flexible    
    | T_Size_Other
    | T_Size_Fit_Content
;

export type T_FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type T_ColorNone = "none";
export type T_RGB       = `rgb(${number},${number},${number})`;
export type T_RGBA      = `rgba(${number},${number},${number},${number})`;
export type T_Color     = 
    | T_RGB
    | T_RGBA
    | "none"
;

export type T_BorderWidth_Left           = T_Size_Absolute;
export type T_BorderWidth_Right          = T_Size_Absolute;
export type T_BorderWidth_Top            = T_Size_Absolute;
export type T_BorderWidth_Bottom         = T_Size_Absolute;
export type T_BorderWidth_Horizontal     = T_Size_Absolute;
export type T_BorderWidth_Vertical       = T_Size_Absolute;
export type T_BorderWidth_All            = T_Size_Absolute;
export type T_BorderWidth_Axis           = `${T_BorderWidth_Vertical} ${T_BorderWidth_Horizontal}`
export type T_BorderWidth_SemiHorizontal = `${T_BorderWidth_Top} ${T_BorderWidth_Horizontal} ${T_BorderWidth_Bottom}`;
export type T_BorderWidth_EachBorder     = `${T_BorderWidth_Top} ${T_BorderWidth_Right} ${T_BorderWidth_Bottom} ${T_BorderWidth_Left}`;
export type T_BorderWidth                =
    | T_BorderWidth_All
    | T_BorderWidth_Axis
    | T_BorderWidth_SemiHorizontal
    | T_BorderWidth_EachBorder
;
