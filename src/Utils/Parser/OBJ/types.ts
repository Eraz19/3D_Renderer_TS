import * as Primitive from "eraz-lib/build/Primitive";


import * as Vector from "../../Vector";


export type T_Edges            = T_Edge[];
export type T_Edge             = Primitive.Tuple.Types.T_Tuple<number,2>;
export type T_OBJParsingResult =
{
	vertices : Vector.Types.T_Vec3D[];
	edges    : T_Edge[];
};
