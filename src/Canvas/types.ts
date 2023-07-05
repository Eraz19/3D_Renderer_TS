import * as Primitive from "eraz-lib/build/Primitive";
import * as Point     from "eraz-lib/build/Graphic/Point";
import * as Color     from "eraz-lib/build/Graphic/Color";

// Nomenclature for matrices types : T_Matrix_Row_Col

export type T_Matrix =
	| T_Matrix_2_2
	| T_Matrix_2_3
	| T_Matrix_3_3
	| T_Matrix_4_4
;

export type T_SquareMatrix =
	| T_Matrix_2_2
	| T_Matrix_3_3
	| T_Matrix_4_4
;

export type T_Matrix_2_2 = Primitive.Tuple.Types.T_Tuple<Primitive.Tuple.Types.T_Tuple<number,2>,2>;
export type T_Matrix_3_3 = Primitive.Tuple.Types.T_Tuple<Primitive.Tuple.Types.T_Tuple<number,3>,3>;
export type T_Matrix_4_4 = Primitive.Tuple.Types.T_Tuple<Primitive.Tuple.Types.T_Tuple<number,4>,4>;
export type T_Matrix_2_3 = Primitive.Tuple.Types.T_Tuple<Primitive.Tuple.Types.T_Tuple<number,3>,2>;


export type T_EventsResult =
{
	zoom:number;
	xRotation:number;
	yRotation:number;
	zRotation:number;
	projection:"xy"|"xz"|"yz";
};


export type T_PointDisplay =
{
	point:Point.Types.T_Point2D;
	color:Color.RGB.Types.T_Color;
};