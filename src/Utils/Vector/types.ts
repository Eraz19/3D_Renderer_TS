import * as Primitive from "eraz-lib/build/Primitive";


export type T_Vec2D = Primitive.Tuple.Types.T_Tuple<number,2>;
export type T_Vec3D = Primitive.Tuple.Types.T_Tuple<number,3>;
export type T_Vec4D = Primitive.Tuple.Types.T_Tuple<number,4>;
export type T_Vec   = 
	| T_Vec2D
	| T_Vec3D
	| T_Vec4D
;
