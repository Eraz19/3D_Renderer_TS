import * as Types from "./type";
import      Style from "./style.module.scss";


export function Component(props : Types.T_Props) : JSX.Element
{
    return (
        <div
            className = {`${Style.Button} ${(props.disabled) ? Style.Disabled : ""}`}
            onClick   = {() =>
            {
                if (props.onClick && (props.disabled == null || props.disabled === false ))
                    props.onClick();
            }}
            style     =
            {
                {
                    ["--button-padding-horizontal"          as string]: props.style          ?.normal?.paddingHorizontal,     
                    ["--button-padding-vertical"            as string]: props.style          ?.normal?.paddingVertical,     
                    ["--button-border-radius"               as string]: props.style          ?.normal?.borderRadius,      
                    ["--button-color"                       as string]: props.style          ?.normal?.color,   
                    ["--button-background"                  as string]: props.style          ?.normal?.background,       
                    ["--button-font-size"                   as string]: props.style          ?.normal?.fontSize,           
                    ["--button-font-weight"                 as string]: props.style          ?.normal?.fontWeight,        
                    ["--hover-button-color"                 as string]: props.style          ?.hover ?.color,        
                    ["--hover-button-background"            as string]: props.style          ?.hover ?.background,           
                    ["--hover-button-font-size"             as string]: props.style          ?.hover ?.fontSize,        
                    ["--hover-button-font-weight"           as string]: props.style          ?.hover ?.fontWeight,           
                    ["--active-button-color"                as string]: props.style          ?.active?.color,           
                    ["--active-button-background"           as string]: props.style          ?.active?.background,              
                    ["--active-button-font-size"            as string]: props.style          ?.active?.fontSize,              
                    ["--active-button-font-weight"          as string]: props.style          ?.active?.fontWeight,               
                    ["--disabled-button-color"              as string]: props.style?.disabled?.normal?.color,            
                    ["--disabled-button-background"         as string]: props.style?.disabled?.normal?.background,               
                    ["--disabled-button-font-size"          as string]: props.style?.disabled?.normal?.fontSize,            
                    ["--disabled-button-font-weight"        as string]: props.style?.disabled?.normal?.fontWeight,            
                    ["--hover-disabled-button-color"        as string]: props.style?.disabled?.hover ?.color,                
                    ["--hover-disabled-button-background"   as string]: props.style?.disabled?.hover ?.background,             
                    ["--hover-disabled-button-font-size"    as string]: props.style?.disabled?.hover ?.fontSize,             
                    ["--hover-disabled-button-font-weight"  as string]: props.style?.disabled?.hover ?.fontWeight,            
                    ["--active-disabled-button-color"       as string]: props.style?.disabled?.active?.color,           
                    ["--active-disabled-button-background"  as string]: props.style?.disabled?.active?.background,          
                    ["--active-disabled-button-font-size"   as string]: props.style?.disabled?.active?.fontSize,               
                    ["--active-disabled-button-font-weight" as string]: props.style?.disabled?.active?.fontWeight,             
                }
            }
        >
            {props.children}
        </div>
    );
};

export * as Types from "./type";
