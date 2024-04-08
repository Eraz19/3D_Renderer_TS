import * as React from "react";


import * as Types from "./type";
import      Style from "./style.module.scss";


export function Component(props : Types.T_Props) : JSX.Element
{
    return (
        <div className={Style.Container}>
            <div
                className = {Style.LoaderSpinner}
                style     = {{ ["--spinner-color" as string]: props.color }}
            />
        </div>
    );
};
