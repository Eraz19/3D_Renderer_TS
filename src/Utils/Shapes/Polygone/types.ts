import * as Coord from "../../Coord";
import * as Color from "../../Color";


export type T_Polygone2D = Coord.Types.T_Coord2D[];
export type T_Polygone3D = Coord.Types.T_Coord3D[];
export type T_Polygone   =
	| T_Polygone2D
	| T_Polygone3D
;

export type T_ColoredPolygone<T extends T_Polygone> =
{
	coord:T;
	color:Color.RGB.Types.T_Color;
};
