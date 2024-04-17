import * as ErazLib from "eraz-lib";


import * as UIRasterizerTypes from "./Rasterizer/types";


export enum E_CameraMode
{
	NORMAL,
	INVERSE,
};
export enum E_RasterizerAction
{
	NONE,
	ZOOM,
	DRAG,
	ROTATE,
};
export enum E_MouseStatus
{
    DOWN,
    UP,
};


export type T_MouseInput =
{
    status : E_MouseStatus;
};
export type T_KeyBinding =
{
    keys   : string[];
    action : string;
};
export type T_KeyBindings =
{
	rotateCamera ?: T_KeyBinding;
    dragCamera   ?: T_KeyBinding;
	resetAnchor  ?: T_KeyBinding;
	resetCamera  ?: T_KeyBinding;
    openOverlay  ?: T_KeyBinding;
};
export type T_KeyboardInput =
{
	stack       : Set<string>;
	keybindings : T_KeyBindings;
};
export type T_Input =
{
    mouse    : T_MouseInput;
	keyboard : T_KeyboardInput;
};
export type T_Event =
{
    action          : E_RasterizerAction;
    dragEnabled     : boolean;
    rotateEnabled   : boolean;
    zoomEnabled     : boolean;
    keyboardEnabled : boolean;
};


export type T_KeyBindingsSetting = {[P in keyof Omit<T_KeyBindings, "openOverlay" | "dragCamera">]?: string[]};
export type T_KeyboardSettings =
{
    enabled     ?: boolean;
    keybindings ?: T_KeyBindingsSetting;
};
export type T_ZoomSetting =
{
    enabled    ?: boolean;
	maxRadius  ?: number;
	minRadius  ?: number;
	zoomFactor ?: number;
};
export type T_DragSettings =
{
    enabled    ?: boolean;
	dragMode   ?: E_CameraMode;
	dragFactor ?: number;  
};
export type T_RotateSettings =
{
    enabled      ?: boolean;
	rotateMode   ?: E_CameraMode;
	rotateFactor ?: number;  
};

export type T_Props =
{
	defaultCamera     : UIRasterizerTypes.T_PolarCamera;
	mesh              : UIRasterizerTypes.T_ModelMesh<number>;
	dragSettings     ?: T_DragSettings;
	rotateSettings   ?: T_RotateSettings;
	zoomSettings     ?: T_ZoomSetting;
	keyboardSettings ?: T_KeyboardSettings;
	background       ?: ErazLib.Graphic.Color.RGB.Types.T_Color;
	onStartDrag      ?: () => void;
    onEndDrag        ?: () => void;
	onStartRotate    ?: () => void;
    onEndRotate      ?: () => void;
	cameraDebug      ?: (polarCamera : UIRasterizerTypes.T_PolarCamera) => void;
};
