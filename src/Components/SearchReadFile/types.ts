import * as Polygone from "../../Utils/Shapes/Polygone";


export type T_Props =
{
	getMeshModel:(modelMesh:Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[]) => void;
	fileExtension:"obj";
};
