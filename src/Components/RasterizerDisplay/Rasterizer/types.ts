import * as ErazLib from "eraz-lib/dist";


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


export type T_PhiAngle         = number;
export type T_ThetaAngle       = number;
export type T_Raduis           = number;
export type T_PolarCoordSystem = [T_PhiAngle,T_ThetaAngle,T_Raduis];
export type T_PolarCamera      =
{
	anchor     : ErazLib.Graphic.Vector.Types.T_Vec3D;
	polarCoord : T_PolarCoordSystem;
};

export type T_CameraState = T_PolarCamera &
{
	initialAnchor         : ErazLib.Graphic.Vector.Types.T_Vec3D;
	initialCamera         : T_PolarCoordSystem;
	cameraToWorldMatrix  ?: ErazLib.Graphic.Matrix.Types.T_Matrix_4_4;
	worldToCameraMatrix  ?: ErazLib.Graphic.Matrix.Types.T_Matrix_4_4;
	cameraToAnchorVector ?: ErazLib.Graphic.Vector.Types.T_Vec3D;
	cameraToTopVector    ?: ErazLib.Graphic.Vector.Types.T_Vec3D;
	cameraToSideVector   ?: ErazLib.Graphic.Vector.Types.T_Vec3D;
};


export type T_CanvasSize =
{
	width  : number;
	height : number;
};


export type T_ModelMesh_Vertices = T_ModelMesh_Vertex[];
export type T_ModelMesh_Vertex   = ErazLib.Graphic.Vector.Types.T_Vec3D;

export type T_Edge<T>            = ErazLib.Primitive.Tuple.Types.T_Tuple<T,2>;
export type T_ModelMesh_Edges<T> = (T_ModelMesh_Edge<T> | null)[];
export type T_ModelMesh_Edge<T>  =
{
	edge  : T_Edge<T>;
	color : ErazLib.Graphic.Color.RGB.Types.T_Color;
};

export type T_ModelMesh<T> = 
{
	vertices : T_ModelMesh_Vertex[];
    edges    : T_ModelMesh_Edges<T>;
};


export type T_CoordinateBases3D_Vertices = ErazLib.Primitive.Tuple.Types.T_Tuple<T_ModelMesh_Vertex,4>;
export type T_CoordinateBases3D_Edges    = ErazLib.Primitive.Tuple.Types.T_Tuple<T_ModelMesh_Edge<number>,3>;
export type T_CoordinateBases3D          = 
{
	vertices : T_CoordinateBases3D_Vertices;
    edges    : T_CoordinateBases3D_Edges;
};

export type T_RenderLoopState =
{
	frameTime           : T_Second;
	frameCount          : number;
	cameraSnapShot     ?: T_PolarCamera;
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
	background                ?: ErazLib.Graphic.Color.RGB.Types.T_Color;
	renderLoop                ?: T_RenderLoopState;
};
