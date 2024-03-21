import * as RasterizerDisplayTypes from "../types";

import * as Types from "./types";
import      Style from "./style.module.scss";


export function Component(props : Types.T_Props) : JSX.Element
{
    function FormatCommandName(value : string) : string
    {
        return (
            value
            .replace(/(^[a-z])|(\s[a-z])/g, (letter : string) => { return (letter.toUpperCase()); })
            .replace(/([A-Z])/g, " $1")
            .trim()
        );
    };

    return (
        <div className={Style.Container}>
            <div className={Style.KeyBindingsPanel}>
            {
                <>
                    <div className={Style.KeyBinding}>
                        <div className={`${Style.Name  } ${Style.Header}`}  >Command</div>
                        <div className={`${Style.Keys  } ${Style.Header}`}  >Keys   </div>
                        <div className={`${Style.Action} ${Style.Header}`}>Action </div>
                    </div>
                    {
                        Object.entries(props.keyBindings ?? {}).map((keyBinding : [string,RasterizerDisplayTypes.T_KeyBinding], index : number) : JSX.Element =>
                        {
                            return (
                                <div
                                    key       = {`keyBinding_${index}`}
                                    className = {Style.KeyBinding}
                                >
                                    <div className={Style.Name}>{FormatCommandName(keyBinding[0])}</div>
                                    <div className={Style.Keys}>
                                    {
                                        keyBinding[1].keys.map((key : string, index : number) : JSX.Element =>
                                        {
                                            if (index < keyBinding[1].keys.length - 1) return (<div className={Style.Key} key={`key_${index}`}><div className={Style.KeyValue}>{key}</div><div> + </div></div>);
                                            else                                       return (<div className={Style.Key} key={`key_${index}`}><div className={Style.KeyValue}>{key}</div></div>)
                                        })
                                    }
                                    </div>
                                    <div className={Style.Action}>
                                        {
                                            (keyBinding[1].action.length !== 0)
                                            ?   <div className={Style.ActionValue}>{keyBinding[1].action}</div>
                                            :   null 
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </>
            }
            </div>
        </div>
    );
};
