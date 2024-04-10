import * as React  from "react";


import * as Types from "./type";
import      Style from "./style.module.scss";


export function Component(props : Types.T_Props) : JSX.Element
{
    const [isValid  , setIsValid  ] = React.useState<boolean>(true);
    const [isFocused, setIsFocused] = React.useState<boolean>(false);

    React.useEffect(() =>
    {
        if (props.errorMessage) setIsValid(false);
        else                    setIsValid(true);
    }, [props.errorMessage]);

    return (
        <div className={Style.Container}>
            {
                (props.label)
                ?   <label
                        className = {`${Style.Label} ${(!isValid) ? Style.Invalid : ""} ${(isFocused) ?  Style.Focus : ""}`}
                        style     =
                        {
                            {
                                ["--label-side"                      as string]: props.style?.label         ?.normal?.side,
                                ["--label-padding-vertical"          as string]: props.style?.label         ?.normal?.paddingVertical,
                                ["--label-padding-horizontal"        as string]: props.style?.label         ?.normal?.paddingHorizontal,
                                ["--label-color"                     as string]: props.style?.label         ?.normal?.color,
                                ["--label-font-size"                 as string]: props.style?.label         ?.normal?.fontSize,
                                ["--label-font-weight"               as string]: props.style?.label         ?.normal?.fontWeight,
                                ["--hover-label-color"               as string]: props.style?.label         ?.hover ?.color,
                                ["--hover-label-font-size"           as string]: props.style?.label         ?.hover ?.fontSize,
                                ["--hover-label-font-weight"         as string]: props.style?.label         ?.hover ?.fontWeight,
                                ["--focus-label-color"               as string]: props.style?.label         ?.focus ?.color,
                                ["--focus-label-font-size"           as string]: props.style?.label         ?.focus ?.fontSize,
                                ["--focus-label-font-weight"         as string]: props.style?.label         ?.focus ?.fontWeight,
                                ["--invalid-label-color"             as string]: props.style?.label?.invalid?.normal?.color,
                                ["--invalid-label-font-size"         as string]: props.style?.label?.invalid?.normal?.fontSize,
                                ["--invalid-label-font-weight"       as string]: props.style?.label?.invalid?.normal?.fontWeight,
                                ["--invalid-hover-label-color"       as string]: props.style?.label?.invalid?.hover ?.color,
                                ["--invalid-hover-label-font-size"   as string]: props.style?.label?.invalid?.hover ?.fontSize,
                                ["--invalid-hover-label-font-weight" as string]: props.style?.label?.invalid?.hover ?.fontWeight,
                                ["--invalid-focus-label-color"       as string]: props.style?.label?.invalid?.focus?.color,
                                ["--invalid-focus-label-font-size"   as string]: props.style?.label?.invalid?.focus?.fontSize,
                                ["--invalid-focus-label-font-weight" as string]: props.style?.label?.invalid?.focus?.fontWeight,
                            }
                        }
                    >
                        {props.label}
                    </label>
                :   null
            }
            <input
                className = {`${Style.Input} ${(!isValid) ? Style.Invalid : ""} ${(isFocused) ?  Style.Focus : ""}`}
                style=
                {
                    {
                        ["--input-padding-vertical"           as string]: props.style?.input         ?.normal?.paddingVertical,
                        ["--input-padding-horizontal"         as string]: props.style?.input         ?.normal?.paddingHorizontal,
                        ["--input-color"                      as string]: props.style?.input         ?.normal?.color,
                        ["--input-font-size"                  as string]: props.style?.input         ?.normal?.fontSize,
                        ["--input-font-weight"                as string]: props.style?.input         ?.normal?.fontWeight,
                        ["--caret-color"                      as string]: props.style?.caret         ?.normal?.color,
                        ["--input-border-color"               as string]: props.style?.input         ?.normal?.borderColor,
                        ["--input-border-width"               as string]: props.style?.input         ?.normal?.borderWidth,
                        ["--input-border-radius"              as string]: props.style?.input         ?.normal?.borderRadius,
                        ["--input-background"                 as string]: props.style?.input         ?.normal?.background,
                        ["--hover-input-color"                as string]: props.style?.input         ?.hover ?.color,
                        ["--hover-input-font-size"            as string]: props.style?.input         ?.hover ?.fontSize,
                        ["--hover-input-font-weight"          as string]: props.style?.input         ?.hover ?.fontWeight,
                        ["--hover-caret-color"                as string]: props.style?.caret         ?.hover ?.color,
                        ["--hover-input-border-color"         as string]: props.style?.input         ?.hover ?.borderColor,
                        ["--hover-input-border-width"         as string]: props.style?.input         ?.hover ?.borderWidth,
                        ["--hover-input-background"           as string]: props.style?.input         ?.hover ?.background,
                        ["--focus-input-color"                as string]: props.style?.input         ?.focus ?.color,
                        ["--focus-input-font-size"            as string]: props.style?.input         ?.focus ?.fontSize,
                        ["--focus-input-font-weight"          as string]: props.style?.input         ?.focus ?.fontWeight,
                        ["--focus-caret-color"                as string]: props.style?.caret         ?.focus ?.color,
                        ["--focus-input-border-color"         as string]: props.style?.input         ?.focus ?.borderColor,
                        ["--focus-input-border-width"         as string]: props.style?.input         ?.focus ?.borderWidth,
                        ["--focus-input-background"           as string]: props.style?.input         ?.focus ?.background,
                        ["--invalid-input-color"              as string]: props.style?.input?.invalid?.normal?.color,
                        ["--invalid-input-font-size"          as string]: props.style?.input?.invalid?.normal?.fontSize,
                        ["--invalid-input-font-weight"        as string]: props.style?.input?.invalid?.normal?.fontWeight,
                        ["--invalid-caret-color"              as string]: props.style?.caret?.invalid?.normal?.color,
                        ["--invalid-input-border-color"       as string]: props.style?.input?.invalid?.normal?.borderColor,
                        ["--invalid-input-border-width"       as string]: props.style?.input?.invalid?.normal?.borderWidth ,
                        ["--invalid-input-background"         as string]: props.style?.input?.invalid?.normal?.background,
                        ["--invalid-hover-input-color"        as string]: props.style?.input?.invalid?.hover ?.color,
                        ["--invalid-hover-input-font-weight"  as string]: props.style?.input?.invalid?.hover ?.fontWeight,
                        ["--invalid-hover-input-font-size"    as string]: props.style?.input?.invalid?.hover ?.fontSize,
                        ["--invalid-hover-caret-color"        as string]: props.style?.caret?.invalid?.hover ?.color,
                        ["--invalid-hover-input-border-color" as string]: props.style?.input?.invalid?.hover ?.borderColor,
                        ["--invalid-hover-input-border-width" as string]: props.style?.input?.invalid?.hover ?.borderWidth,
                        ["--invalid-hover-input-background"   as string]: props.style?.input?.invalid?.hover ?.background,
                        ["--invalid-focus-input-color"        as string]: props.style?.input?.invalid?.focus ?.color,
                        ["--invalid-focus-input-font-size"    as string]: props.style?.input?.invalid?.focus ?.fontSize,
                        ["--invalid-focus-input-font-weight"  as string]: props.style?.input?.invalid?.focus ?.fontWeight,
                        ["--invalid-focus-caret-color"        as string]: props.style?.caret?.invalid?.focus ?.color,
                        ["--invalid-focus-input-border-color" as string]: props.style?.input?.invalid?.focus ?.borderColor,
                        ["--invalid-focus-input-border-width" as string]: props.style?.input?.invalid?.focus ?.borderWidth,
                        ["--invalid-focus-input-background"   as string]: props.style?.input?.invalid?.focus ?.background,
                    }
                }
                type      = {props.type}
                onFocus   = {() => { setIsFocused(true);  }}
                onBlur    = {() => { setIsFocused(false); }}
                onChange  = {(e : React.ChangeEvent<HTMLInputElement>) : void =>
                {
                    if (props.onChange)
                        props.onChange(e.currentTarget.value);
                }}
            />
            {
                (!isValid)
                ?   <div
                        className = {`${Style.ErrorMessage} ${(isFocused) ?  Style.Focus : ""}`}
                        style     =
                        {
                            {
                                ["--error-message-padding-vertical"   as string]: props.style?.errorMessage?.normal?.paddingVertical,
                                ["--error-message-padding-horizontal" as string]: props.style?.errorMessage?.normal?.paddingHorizontal,
                                ["--error-message-color"              as string]: props.style?.errorMessage?.normal?.color,
                                ["--error-message-font-size"          as string]: props.style?.errorMessage?.normal?.fontSize,
                                ["--error-message-font-weight"        as string]: props.style?.errorMessage?.normal?.fontWeight,
                                ["--hover-error-message-color"        as string]: props.style?.errorMessage?.hover ?.color,
                                ["--hover-error-message-font-size"    as string]: props.style?.errorMessage?.hover ?.fontSize,
                                ["--hover-error-message-font-weight"  as string]: props.style?.errorMessage?.hover ?.fontWeight,
                                ["--focus-error-message-color"        as string]: props.style?.errorMessage?.focus ?.color,
                                ["--focus-error-message-font-size"    as string]: props.style?.errorMessage?.focus ?.fontSize,
                                ["--focus-error-message-font-weight"  as string]: props.style?.errorMessage?.focus ?.fontSize,
                            }
                        }
                    >
                        {props.errorMessage}
                    </div>
                :   null
            }
        </div>
    );
};

export * as Types from "./type";
