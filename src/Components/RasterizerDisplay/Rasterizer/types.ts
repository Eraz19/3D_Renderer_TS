import * as Primitive from "eraz-lib/build/Primitive";


import * as PolarCamera from "../../../Utils/Rasterizer/PolarCamera";
import * as Coord       from "../../../Utils/Coord";
import * as Matrix      from "../../../Utils/Matrix";
import * as Vector      from "../../../Utils/Vector";
import * as Color       from "../../../Utils/Color";


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


export type T_Edge<T>            = Primitive.Tuple.Types.T_Tuple<T,2>;
export type T_ModelMesh_Vertices = T_ModelMesh_Vertex[];
export type T_ModelMesh_Vertex   = Vector.Types.T_Vec3D;

export type T_ModelMesh_Edges<T> = (T_ModelMesh_Edge<T> | null)[];
export type T_ModelMesh_Edge<T>  =
{
	edge  : T_Edge<T>;
	color : Color.RGB.Types.T_Color;
};
export type T_ModelMesh<T> = 
{
	vertices : T_ModelMesh_Vertex[];
    edges    : T_ModelMesh_Edges<T>;
};

export type T_CoordinateBases3D_Vertices = Primitive.Tuple.Types.T_Tuple<T_ModelMesh_Vertex,4>;
export type T_CoordinateBases3D_Edges    = Primitive.Tuple.Types.T_Tuple<T_ModelMesh_Edge<number>,3>;
export type T_CoordinateBases3D = 
{
	vertices : T_CoordinateBases3D_Vertices;
    edges    : T_CoordinateBases3D_Edges;
};

export type T_RenderLoopState =
{
	frameTime           : T_Second;
	frameCount          : number;
	cameraSnapShot     ?: PolarCamera.Types.T_PolarCamera;
	canvasSizeSnapShot ?: T_CanvasSize;
	meshSnapShot       ?: T_ModelMesh<number>;
	renderEnd          ?: Date;
	renderStart        ?: Date;
};

export type T_RasterizerContext =
{
	meshToRender              ?: T_ModelMesh<number>;
	modelMesh                 ?: T_ModelMesh<number>;
	coordinateSystemBases     ?: T_CoordinateBases3D;
	coordinateSystemBasesSize ?: number;
    canvasRef                 ?: HTMLCanvasElement;
	canvasSize                ?: T_CanvasSize;
    camera                    ?: T_CameraState;
	background                ?: Color.RGB.Types.T_Color;
	renderLoop                ?: T_RenderLoopState;
};



