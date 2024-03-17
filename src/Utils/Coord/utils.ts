import * as Types  from "./types";
import * as Vector from "../Vector";


export function IsCoord_2(coord : Types.T_Coord) : coord is Types.T_Coord2D { return ('x' in coord && 'y' in coord); };
export function IsCoord_3(coord : Types.T_Coord) : coord is Types.T_Coord3D { return ('x' in coord && 'y' in coord && 'z' in coord); };
export function IsCoord_4(coord : Types.T_Coord) : coord is Types.T_Coord4D { return ('x' in coord && 'y' in coord && 'z' in coord && 'w' in coord); };

function FromCoord_ToVec_2(coord : Types.T_Coord2D) : Vector.Types.T_Vec2D { return ([coord.x, coord.y]); };
function FromCoord_ToVec_3(coord : Types.T_Coord3D) : Vector.Types.T_Vec3D { return ([coord.x, coord.y, coord.z]); };
function FromCoord_ToVec_4(coord : Types.T_Coord4D) : Vector.Types.T_Vec4D { return ([coord.x, coord.y, coord.z, coord.w]); }
export function FromCoord_ToVec(coord : Types.T_Coord2D) : Vector.Types.T_Vec2D
export function FromCoord_ToVec(coord : Types.T_Coord3D) : Vector.Types.T_Vec3D
export function FromCoord_ToVec(coord : Types.T_Coord4D) : Vector.Types.T_Vec4D
export function FromCoord_ToVec(coord : Types.T_Coord  ) : Vector.Types.T_Vec
{
	if      (IsCoord_4(coord)) return (FromCoord_ToVec_4(coord));
	else if (IsCoord_3(coord)) return (FromCoord_ToVec_3(coord));
	else if (IsCoord_2(coord)) return (FromCoord_ToVec_2(coord));
	else                       return (coord);
};

function Add_2(
	coord  : Types.T_Coord2D,
	vector : Vector.Types.T_Vec2D,
) : Types.T_Coord2D
{
	return ({ x : coord.x + vector[0], y: coord.y + vector[1] });
};
function Add_3(
	coord  : Types.T_Coord3D,
	vector : Vector.Types.T_Vec3D,
) : Types.T_Coord3D
{
	return ({ x: coord.x + vector[0], y: coord.y + vector[1], z: coord.z + vector[2] });
};
function Add_4(
	coord  : Types.T_Coord4D,
	vector : Vector.Types.T_Vec4D,
) : Types.T_Coord4D
{
	return ({ x: coord.x + vector[0], y: coord.y + vector[1], z: coord.z + vector[2], w: coord.w + vector[3] });
};
export function Add(
	coord  : Types.T_Coord2D,
	vector : Vector.Types.T_Vec2D,
) : Types.T_Coord2D
export function Add(
	coord  : Types.T_Coord3D,
	vector : Vector.Types.T_Vec3D,
) : Types.T_Coord3D
export function Add(
	coord  : Types.T_Coord4D,
	vector : Vector.Types.T_Vec4D,
) : Types.T_Coord4D
export function Add(
	coord  : Types.T_Coord,
	vector : Vector.Types.T_Vec,
) : Types.T_Coord
{
	if      (IsCoord_2(coord) && Vector.Utils.IsVector_2(vector)) return (Add_2(coord, vector));
	else if (IsCoord_3(coord) && Vector.Utils.IsVector_3(vector)) return (Add_3(coord, vector));
	else if (IsCoord_4(coord) && Vector.Utils.IsVector_4(vector)) return (Add_4(coord, vector));
	else                                                          return ({} as never);
};

function DeepCopy_2(coord : Types.T_Coord2D) : Types.T_Coord2D
{
	return ({ x : coord.x, y: coord.y });
};
function DeepCopy_3(coord : Types.T_Coord3D) : Types.T_Coord3D
{
	return ({ x: coord.x, y: coord.y, z: coord.z });
};
function DeepCopy_4(coord : Types.T_Coord4D) : Types.T_Coord4D
{
	return ({ x: coord.x, y: coord.y, z: coord.z, w: coord.w });
};
export function DeepCopy(coord : Types.T_Coord2D) : Types.T_Coord2D
export function DeepCopy(coord : Types.T_Coord3D) : Types.T_Coord3D
export function DeepCopy(coord : Types.T_Coord4D) : Types.T_Coord4D
export function DeepCopy(coord : Types.T_Coord  ) : Types.T_Coord
{
	if      (IsCoord_2(coord)) return (DeepCopy_2(coord));
	else if (IsCoord_3(coord)) return (DeepCopy_3(coord));
	else if (IsCoord_4(coord)) return (DeepCopy_4(coord));
	else                       return ({} as never);
};
