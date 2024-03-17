import * as React from "react";


import * as GlobalTypes from "../../types";

import * as Types from "./types";
import      Style from "./style.module.scss";


const DEFAULT_RESIZE_OFFSET : number = 5;

export function Component(props : Types.T_Props) : JSX.Element
{
    const [cursor, setCursor] = React.useState<Types.E_Cursor>(Types.E_Cursor.NONE);

    const timer = React.useRef<NodeJS.Timeout>();
    const ref   = React.useRef<HTMLDivElement>(null);
    const input = React.useRef<Types.T_WindowInput>(
        {
            mouse:
            {
                status: Types.E_MouseStatus.UP,
                cursor: Types.E_Cursor.NONE,
            },
        }
    ); 
    const windowState = React.useRef<Types.T_WindowState>(
        {
            resizeEnabled: props.resizeEnabled,
            moveEnabled  : props.moveEnabled,
            action       : Types.E_WindowAction.NONE, 
        }
    );

	React.useEffect(() => { windowState.current.moveEnabled   = props.moveEnabled;   }, [props.moveEnabled  ]);
	React.useEffect(() => { windowState.current.resizeEnabled = props.resizeEnabled; }, [props.resizeEnabled]);

    React.useEffect(() =>
    {
        function AddEvents() : void
        {
            window.addEventListener("mousemove", HandleMouseMove);
            window.addEventListener("mouseup"  , HandleMouseUp  );
        };

        function RemoveEvents() : void
        {
            window.removeEventListener("mousemove", HandleMouseMove);
            window.removeEventListener("mouseup"  , HandleMouseUp  );
        };

        AddEvents();

        return (() => { RemoveEvents() });
    }, []);

    /**************************** Utils ****************************/

    function HasAHeaderClassName() : string
    {
        if (props.header) return (Style.WithHeader);
        else              return ("");
    };

    function FromResizeSide_ToClassName(resizeSide : Types.E_Cursor) : string
    {
        if      (resizeSide === Types.E_Cursor.NONE        ) return ("");
        else if (resizeSide === Types.E_Cursor.LEFT        ) return (Style.Left);
        else if (resizeSide === Types.E_Cursor.RIGHT       ) return (Style.Right);
        else if (resizeSide === Types.E_Cursor.TOP         ) return (Style.Top);
        else if (resizeSide === Types.E_Cursor.BOTTOM      ) return (Style.Bottom);
        else if (resizeSide === Types.E_Cursor.LEFT_TOP    ) return (Style.Left_Top);
        else if (resizeSide === Types.E_Cursor.RIGHT_TOP   ) return (Style.Right_Top);
        else if (resizeSide === Types.E_Cursor.LEFT_BOTTOM ) return (Style.Left_Bottom);
        else if (resizeSide === Types.E_Cursor.RIGHT_BOTTOM) return (Style.Right_Bottom);
        else if (resizeSide === Types.E_Cursor.CROSS       ) return (Style.Cross);
        else                                                 return ("");
    };

    function UpdateCursorValue(value : Types.E_Cursor) : void
    {
        setCursor(value);
        input.current.mouse.cursor = value;
    };

    function UpdateResizeCursor(e : React.MouseEvent<HTMLDivElement>) : void
    {
        const offset : number = props.resizeSettings?.offset ?? DEFAULT_RESIZE_OFFSET;
    
        if (ref.current && input.current.mouse.status === Types.E_MouseStatus.UP && windowState.current.resizeEnabled)
        {
            const windowRect : DOMRect = ref.current.getBoundingClientRect();

            if (e.clientX <= (windowRect.left + offset))
            {
                if      (e.clientY <= (windowRect.top + offset))    UpdateCursorValue(Types.E_Cursor.LEFT_TOP);
                else if (e.clientY >= (windowRect.bottom - offset)) UpdateCursorValue(Types.E_Cursor.LEFT_BOTTOM);
                else                                                UpdateCursorValue(Types.E_Cursor.LEFT);   

                OnResizeStart();
            }
            else if (e.clientX >= (windowRect.right - offset))
            {
                if      (e.clientY <= (windowRect.top + offset))    UpdateCursorValue(Types.E_Cursor.RIGHT_TOP);
                else if (e.clientY >= (windowRect.bottom - offset)) UpdateCursorValue(Types.E_Cursor.RIGHT_BOTTOM);
                else                                                UpdateCursorValue(Types.E_Cursor.RIGHT);

                OnResizeStart();
            }
            else if (e.clientY <= (windowRect.top + offset))
            {
                UpdateCursorValue(Types.E_Cursor.TOP);
                OnResizeStart();
            }
            else if (e.clientY >= (windowRect.bottom - offset))
            {
                UpdateCursorValue(Types.E_Cursor.BOTTOM);
                OnResizeStart();
            }
            else
            {
                UpdateCursorValue(Types.E_Cursor.NONE);
                OnMoveEnd();
                OnResizeEnd();
            }
        }
    };

    function OnMoveStart() : void
    {
        if (windowState.current.action !== Types.E_WindowAction.MOVE)
        {
            windowState.current.action = Types.E_WindowAction.MOVE;
            UpdateCursorValue(Types.E_Cursor.CROSS);

            if (props.onStartMove)
                props.onStartMove();
        }
    };

    function OnMoveEnd() : void
    {
        if (windowState.current.action === Types.E_WindowAction.MOVE)
        {
            windowState.current.action = Types.E_WindowAction.NONE;

            if (props.onEndMove)
                props.onEndMove();
        }
    };

    function OnResizeStart() : void
    {
        if (windowState.current.action !== Types.E_WindowAction.RESIZE)
        {
            windowState.current.action = Types.E_WindowAction.RESIZE;

            if (props.onStartResize)
                props.onStartResize();
        }
    };

    function OnResizeEnd() : void
    {
        if (windowState.current.action === Types.E_WindowAction.RESIZE)
        {
            windowState.current.action = Types.E_WindowAction.NONE;

            if (props.onEndResize)
                props.onEndResize();
        }
    };

    function WindowStyle() : GlobalTypes.T_CssCustomProperties
    {
        return (
            {
                ["--window-width"        ]: (props.window.width      ) ? `${props.window.width      }px` : undefined,
                ["--window-height"       ]: (props.window.height     ) ? `${props.window.height     }px` : undefined,
                ["--window-left"         ]: (props.window.left       ) ? `${props.window.left       }px` : undefined,
                ["--window-top"          ]: (props.window.top        ) ? `${props.window.top        }px` : undefined,
                ["--window-border-width" ]: (props.window.borderWidth) ? `${props.window.borderWidth}px` : undefined,
                ["--window-header-height"]: (props.header?.height    ) ? `${props.header.height     }px` : undefined,
                ["--window-border-color" ]: props.window.borderColor,
                ["--window-z-index"      ]: props.window.zIndex,
            }
        );
    };

    /**************************** Events Handler ****************************/

    function HandleMouseUp() : void
    {
        input.current.mouse.status = Types.E_MouseStatus.UP;
        clearTimeout(timer.current);
    };

    function HandleMouseDown() : void
    {
        input.current.mouse.status = Types.E_MouseStatus.DOWN;

        timer.current = setTimeout(() =>
        {
            if (input.current.mouse.cursor !== Types.E_Cursor.NONE && windowState.current.moveEnabled)
                OnMoveStart();
        }, 1000);
    };

    function HandleMouseMove(e : MouseEvent) : void
    {
        function MoveWindow(e : MouseEvent) : void
        {
            function UpdateWindowHorizontalMove(xOffset : number) : void
            {
                if (ref.current)
                {
                    const resizableElementStyle : CSSStyleDeclaration = window.getComputedStyle(ref.current);
                    const left                  : number              = parseInt(resizableElementStyle.left, 10);
                    
                    ref.current.style.left = `${left  + xOffset}px`;
                }
            };
    
            function UpdateWindowVerticalMove(xOffset : number) : void
            {
                if (ref.current)
                {
                    const resizableElementStyle : CSSStyleDeclaration = window.getComputedStyle(ref.current);
                    const top                  : number              = parseInt(resizableElementStyle.top , 10);
                    
                    ref.current.style.top = `${top  + xOffset}px`;
                }
            };
    
            clearTimeout(timer.current);

            UpdateWindowHorizontalMove(e.movementX);
            UpdateWindowVerticalMove  (e.movementY)
        };

        function ResizeWindow(e : MouseEvent) : void
        {
            function UpdateWindowLeftSize(xOffset : number) : void
            {
                if (ref.current)
                {
                    const resizableElementStyle : CSSStyleDeclaration = window.getComputedStyle(ref.current);
                    const left                  : number              = parseInt(resizableElementStyle.left , 10);
                    const width                 : number              = parseInt(resizableElementStyle.width, 10);
                    
                    ref.current.style.left  = `${left  + xOffset}px`;
                    ref.current.style.width = `${width - xOffset}px`;
                }
            };
    
            function UpdateWindowRightSize(xOffset : number) : void
            {
                if (ref.current)
                {
                    const resizableElementStyle : CSSStyleDeclaration = window.getComputedStyle(ref.current);
                    const width                 : number              = parseInt(resizableElementStyle.width, 10);
    
                    ref.current.style.width = `${width + xOffset}px`;
                }
            };
    
            function UpdateWindowTopSize(yOffset : number) : void
            {
                if (ref.current)
                {
                    const resizableElementStyle : CSSStyleDeclaration = window.getComputedStyle(ref.current);
                    const top                   : number              = parseInt(resizableElementStyle.top   , 10);
                    const height                : number              = parseInt(resizableElementStyle.height, 10);
                    
                    ref.current.style.top   = `${top    + yOffset}px`;
                    ref.current.style.height = `${height - yOffset}px`;
                }
            };
    
            function UpdateWindowBottomSize(yOffset : number) : void
            {
                if (ref.current)
                {
                    const resizableElementStyle : CSSStyleDeclaration = window.getComputedStyle(ref.current);
                    const height                : number              = parseInt(resizableElementStyle.height, 10);
    
                    ref.current.style.height = `${height + yOffset}px`;
                }
            };
    
            function UpdateWindowRightBottomSize(
                xOffset : number,
                yOffset : number,
            ) : void
            {
                UpdateWindowRightSize (xOffset);
                UpdateWindowBottomSize(yOffset);
            };
    
            function UpdateWindowRightTopSize(
                xOffset : number,
                yOffset : number,
            ) : void
            {
                UpdateWindowRightSize (xOffset);
                UpdateWindowTopSize(yOffset);
            };
    
            function UpdateWindowLeftTopSize(
                xOffset : number,
                yOffset : number,
            ) : void
            {
                UpdateWindowLeftSize (xOffset);
                UpdateWindowTopSize(yOffset);
            };
    
            function UpdateWindowLeftBottomSize(
                xOffset : number,
                yOffset : number,
            ) : void
            {
                UpdateWindowLeftSize (xOffset);
                UpdateWindowBottomSize(yOffset);
            };

            clearTimeout(timer.current);

            if      (input.current.mouse.cursor === Types.E_Cursor.LEFT        ) UpdateWindowLeftSize       (e.movementX);
            else if (input.current.mouse.cursor === Types.E_Cursor.RIGHT       ) UpdateWindowRightSize      (e.movementX);
            else if (input.current.mouse.cursor === Types.E_Cursor.TOP         ) UpdateWindowTopSize        (e.movementY);
            else if (input.current.mouse.cursor === Types.E_Cursor.BOTTOM      ) UpdateWindowBottomSize     (e.movementY);
            else if (input.current.mouse.cursor === Types.E_Cursor.LEFT_TOP    ) UpdateWindowLeftTopSize    (e.movementX, e.movementY);
            else if (input.current.mouse.cursor === Types.E_Cursor.RIGHT_TOP   ) UpdateWindowRightTopSize   (e.movementX, e.movementY);
            else if (input.current.mouse.cursor === Types.E_Cursor.LEFT_BOTTOM ) UpdateWindowLeftBottomSize (e.movementX, e.movementY);
            else if (input.current.mouse.cursor === Types.E_Cursor.RIGHT_BOTTOM) UpdateWindowRightBottomSize(e.movementX, e.movementY);
        };

        if (input.current.mouse.status === Types.E_MouseStatus.DOWN)
        {
            if      (windowState.current.action === Types.E_WindowAction.MOVE  ) MoveWindow  (e);
            else if (windowState.current.action === Types.E_WindowAction.RESIZE) ResizeWindow(e);
        }
    };

    return (
        <div
            ref          = {ref}
            className    = {`${Style.Container} ${FromResizeSide_ToClassName(cursor)} ${HasAHeaderClassName()}`}
            onMouseDown  = {HandleMouseDown}
            onMouseUp    = {HandleMouseUp}
            onMouseMove  = {UpdateResizeCursor}
            style        = {WindowStyle()}
        >
            <div
                className={Style.Header}
            />
            <div className={Style.Body}>
                {props.children}
            </div>
        </div>
    );
};
