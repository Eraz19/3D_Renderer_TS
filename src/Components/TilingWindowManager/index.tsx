import * as Types from "./types";
import      Style from "./style.module.scss";


export function Component(props : Types.T_Props) : JSX.Element
{
    return (
        <div className={Style.Container}>
        {
            props.children?.map((elem : JSX.Element, index : number) : JSX.Element =>
            {
                return (<div key={index} className={Style.Element}>{elem}</div>);
            })
        }
        </div>
    );
};
