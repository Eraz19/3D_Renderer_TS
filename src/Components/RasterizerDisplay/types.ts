import * as PolarCamera from "../../Utils/Rasterizer/PolarCamera";
import * as Polygone    from "../../Utils/Shapes/Polygone";
import * as Coord       from "../../Utils/Coord";
import * as Matrix      from "../../Utils/Matrix";


export type T_MousePosition =
{
	x : number;
	y : number;
};

export type T_Camera = PolarCamera.Types.T_PolarCamera &
{
	initialAnchor : Coord.Types.T_Coord3D
	cameraToWorldMatrix : Matrix.Types.T_Matrix_4_4 | undefined;
};

export type T_Props =
{
	defaultCamera:PolarCamera.Types.T_PolarCamera;
	mesh:Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[];
	cameraDebug:(debug:PolarCamera.Types.T_PolarCamera) => void;
};
