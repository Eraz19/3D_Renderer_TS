import * as Color from "../../Color";
import * as Coord from "../../Coord";


export type T_Line2D =
{
	start:Coord.Types.T_Coord2D;
	end:Coord.Types.T_Coord2D;
};
export type T_Line3D =
{
	start:Coord.Types.T_Coord3D;
	end:Coord.Types.T_Coord3D;
};
export type T_Line =
	| T_Line2D
	| T_Line3D
;

export type T_ColoredLine<T extends T_Line> =
{
	coord:T;
	color:Color.RGB.Types.T_Color;
};
