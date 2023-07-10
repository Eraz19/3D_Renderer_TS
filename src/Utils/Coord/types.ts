export type T_Coord2D =
{
	x:number;
	y:number;
};
export type T_Coord3D =
{
	x:number;
	y:number;
	z:number;
};
export type T_Coord4D =
{
	x:number;
	y:number;
	z:number;
	w:number;
};
export type T_Coord =
	| T_Coord2D
	| T_Coord3D
	| T_Coord4D
;
