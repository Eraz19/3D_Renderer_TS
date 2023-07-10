type T_2D = [number,number];
type T_3D = [number,number,number];
type T_4D = [number,number,number,number];


export type T_Vec2D = T_2D;
export type T_Vec3D = T_3D;
export type T_Vec4D = T_4D;
export type T_Vec   = 
	| T_Vec2D
	| T_Vec3D
	| T_Vec4D
;
