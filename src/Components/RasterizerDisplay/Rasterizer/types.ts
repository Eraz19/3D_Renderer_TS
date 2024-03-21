import * as PolarCamera from "../../../Utils/Rasterizer/PolarCamera";
import * as Coord       from "../../../Utils/Coord";
import * as Matrix      from "../../../Utils/Matrix";
import * as Vector      from "../../../Utils/Vector";
import * as Polygone   from "../../../Utils/Shapes/Polygone";
import * as Rasterizer from "../../../Utils/Rasterizer";
import * as Color      from "../../../Utils/Color";


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

export type T_RenderLoopState =
{
	frameTime           : T_Second;
	cameraSnapShot     ?: PolarCamera.Types.T_PolarCamera;
	canvasSizeSnapShot ?: T_CanvasSize;
	renderEnd          ?: Date;
	renderStart        ?: Date;
};

export type T_RasterizerContext =
{
    canvasRef                   ?: HTMLCanvasElement;
	canvasSize               ?: T_CanvasSize;
    camera                   ?: T_CameraState;
    modelMesh                ?: Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[];
	coordinateSystemBases_3D ?: Rasterizer.Types.T_CoordinateBases_3D
	background               ?: Color.RGB.Types.T_Color;
	renderLoop               ?: T_RenderLoopState;
};



