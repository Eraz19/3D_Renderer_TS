import * as PolarCamera from "../../Utils/Rasterizer/PolarCamera";
import * as Polygone    from "../../Utils/Shapes/Polygone";


export type T_Props =
{
	defaultCamera:PolarCamera.Types.T_PolarCamera;
	model:Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[];
};
