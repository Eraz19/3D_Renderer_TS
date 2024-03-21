import * as PolarCamera from "../../../Utils/Rasterizer/PolarCamera";
import * as Coord       from "../../../Utils/Coord";
import * as Matrix      from "../../../Utils/Matrix";
import * as Vector      from "../../../Utils/Vector";
import * as Polygone   from "../../../Utils/Shapes/Polygone";
import * as Rasterizer from "../../../Utils/Rasterizer";
import * as Color      from "../../../Utils/Color";

import * as UIRasterizer from "../Rasterizer";


export type T_Second = number;

export type T_RerenderFunction = (
    canvas                 : HTMLCanvasElement | undefined,
	camera                 : UIRasterizer.Types.T_CameraState,
    coordinateSystemBases ?: Rasterizer.Types.T_CoordinateBases_3D,
    mesh                  ?: Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[],
    background            ?: Color.RGB.Types.T_Color,
) => void

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
	cameraSnapShot      : PolarCamera.Types.T_PolarCamera;
	frameTime           : T_Second;
	canvasSizeSnapShot ?: T_CanvasSize;
	renderEnd          ?: Date;
	renderStart        ?: Date;
};

export type T_RasterizerContext =
{
    canvas                   ?: HTMLCanvasElement;
    camera                   ?: T_CameraState;
    modelMesh                ?: Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[];
	coordinateSystemBases_3D ?: Rasterizer.Types.T_CoordinateBases_3D
	background               ?: Color.RGB.Types.T_Color;
    rerenderFrame            ?: T_RerenderFunction;
	renderLoop               ?: T_RenderLoopState;
};



