import * as Point     from "eraz-lib/build/Graphic/Point";
import * as Color     from "eraz-lib/build/Graphic/Color";
import * as Line      from "eraz-lib/build/Graphic/Line";
import * as Polygone  from "eraz-lib/build/Graphic/Polygone";
import * as Primitive from "eraz-lib/build/Primitive";


export type T_EventsResult =
{
	zoom:number;
	xRotation:number;
	yRotation:number;
	zRotation:number;
	projection:"xy"|"xz"|"yz";
};

export type T_CoordinateBases_3D = Primitive.Tuple.Types.T_Tuple<T_ColoredLine<Line.Types.T_Line3D>, 3>;

export type T_ColoredPoint<T extends Point.Types.T_Point> =
{
	coord:T;
	color:Color.RGB.Types.T_Color;
};

export type T_ColoredLine<T extends Line.Types.T_Line> =
{
	coord:T;
	color:Color.RGB.Types.T_Color;
};

export type T_ColoredPolygone<T extends Polygone.Types.T_Polygone> =
{
	coord:T;
	color:Color.RGB.Types.T_Color;
};
