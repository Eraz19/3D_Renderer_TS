import * as PolarCamera from "../../../Utils/Rasterizer/PolarCamera";
import * as Coord       from "../../../Utils/Coord";
import * as Matrix      from "../../../Utils/Matrix";
import * as Vector      from "../../../Utils/Vector";
import * as Polygone   from "../../../Utils/Shapes/Polygone";
import * as Rasterizer from "../../../Utils/Rasterizer";
import * as Color      from "../../../Utils/Color";


export enum E_CanvasAreas
{
	IN               = "IN",
	OUT_LEFT         = "OUT_LEFT",
	OUT_TOP          = "OUT_TOP",
	OUT_RIGHT        = "OUT_RIGHT",
	OUT_BOTTOM       = "OUT_BOTTOM",
	OUT_LEFT_TOP     = "OUT_LEFT_TOP",
	OUT_RIGHT_TOP    = "OUT_RIGHT_TOP",
	OUT_RIGHT_BOTTOM = "OUT_RIGHT_BOTTOM",
	OUT_LEFT_BOTTOM  = "OUT_LEFT_BOTTOM",
};

export type T_Second = number;

export type T_CameraState = PolarCamera.Types.T_PolarCamera &
{
	initialAnchor         : Coord.Types.T_Coord3D;
	initialCamera         : PolarCamera.Types.T_PolarCoordSystem;
	cameraToWorldMatrix  ?: Matrix.Types.T_Matrix_4_4;
	worldToCameraMatrix  ?: Matrix.Types.T_Matrix_4_4;
	cameraToAnchorVector ?: Vector.Types.T_Vec3D;
	cameraToTopVector    ?: Vector.Types.T_Vec3D;
	cameraToSideVector   ?: Vector.Types.T_Vec3D;
};

export type T_CanvasSize =
{
	width  : number;
	height : number;
};

export type T_ModelMesh = Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[];

export type T_RenderLoopState =
{
	frameTime           : T_Second;
	cameraSnapShot     ?: PolarCamera.Types.T_PolarCamera;
	canvasSizeSnapShot ?: T_CanvasSize;
	meshSnapShot       ?: T_ModelMesh;
	renderEnd          ?: Date;
	renderStart        ?: Date;
};

export type T_RasterizerContext =
{
    canvasRef                ?: HTMLCanvasElement;
	canvasSize               ?: T_CanvasSize;
    camera                   ?: T_CameraState;
    modelMesh                ?: T_ModelMesh;
	coordinateSystemBases_3D ?: Rasterizer.Types.T_CoordinateBases_3D
	background               ?: Color.RGB.Types.T_Color;
	renderLoop               ?: T_RenderLoopState;
};



