export enum E_WindowAction
{
    NONE,
    RESIZE,
    MOVE,
};

export enum E_Cursor
{
    NONE,
    LEFT,
    RIGHT,
    TOP,
    BOTTOM,
    LEFT_TOP,
    RIGHT_TOP,
    LEFT_BOTTOM,
    RIGHT_BOTTOM,
    CROSS,
};

export enum E_MouseStatus
{
    DOWN,
    UP,
};


export type T_MouseInput =
{
    status : E_MouseStatus;
    cursor : E_Cursor;
};

export type T_WindowInput =
{
    mouse : T_MouseInput;
};

export type T_WindowState =
{
    resizeEnabled : boolean;
    moveEnabled   : boolean;
    action        : E_WindowAction;
};


export type T_Header =
{
    height    : number;
    children ?: JSX.Element;
};

export type T_ResizeSetting =
{
    offset : number;
};

export type T_Window =
{
    width       ?: number;
    height      ?: number;
    left        ?: number;
    top         ?: number;
    zIndex      ?: number;
    borderColor ?: string;
    borderWidth ?: number;
};

export type T_Props =
{
    window          : T_Window;
    resizeEnabled   : boolean;
    moveEnabled     : boolean;
    resizeSettings ?: T_ResizeSetting;
    header         ?: T_Header;
    children       ?: JSX.Element;
    onStartResize  ?: () => void;
    onEndResize    ?: () => void;
    onStartMove    ?: () => void;
    onEndMove      ?: () => void;
};
