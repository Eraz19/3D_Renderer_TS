import * as PolarCamera       from "../../Utils/Rasterizer/PolarCamera";
import * as Polygone          from "../../Utils/Shapes/Polygone";
import * as Coord             from "../../Utils/Coord";
import * as Matrix            from "../../Utils/Matrix";
import * as Vector            from "../../Utils/Vector";
import * as RasterizerDisplay from "../RasterizerDisplay";


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

export type T_KeyboardInput =
{
	stack : Set<string>;
};

export type T_RasterizerInput =
{
    mouse    : T_MouseInput;
	keyboard : T_KeyboardInput;
};

export type T_CameraState = PolarCamera.Types.T_PolarCamera &
{
	action                : E_RasterizerAction;
	dragEnabled           : boolean;
	rotateEnabled         : boolean;
	zoomEnabled           : boolean;
	initialAnchor         : Coord.Types.T_Coord3D;
	initialCamera         : PolarCamera.Types.T_PolarCoordSystem;
	cameraToWorldMatrix  ?: Matrix.Types.T_Matrix_4_4;
	worldToCameraMatrix  ?: Matrix.Types.T_Matrix_4_4;
	cameraToAnchorVector ?: Vector.Types.T_Vec3D;
	cameraToTopVector    ?: Vector.Types.T_Vec3D;
	cameraToSideVector   ?: Vector.Types.T_Vec3D;
};


export type T_ZoomSetting =
{
	maxRadius  ?: number;
	minRadius  ?: number;
	zoomFactor ?: number;
};

export type T_DragSettings =
{
	dragMode   ?: E_CameraMode;
	dragFactor ?: number;  
};

export type T_RotateSettings =
{
	rotateMode   ?: E_CameraMode;
	rotateFactor ?: number;  
};

export type T_Props =
{
	defaultCamera   : PolarCamera.Types.T_PolarCamera;
	mesh            : Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[];
	dragEnabled     : boolean;
	rotateEnabled   : boolean;
	zoomEnabled     : boolean;
	dragSettings   ?: T_DragSettings;
	rotateSettings ?: T_RotateSettings;
	zoomSettings   ?: T_ZoomSetting;
	onStartDrag    ?: () => void;
    onEndDrag      ?: () => void;
	onStartRotate  ?: () => void;
    onEndRotate    ?: () => void;
	cameraDebug    ?: React.Dispatch<React.SetStateAction<RasterizerDisplay.Types.T_CameraState | undefined>>;
};
