import * as Types  from "./types";
import * as Vector from "../Vector";


export function IsCoord_2(coord : Types.T_Coord):coord is Types.T_Coord2D { return ('x' in coord && 'y' in coord); };
export function IsCoord_3(coord : Types.T_Coord):coord is Types.T_Coord3D { return ('x' in coord && 'y' in coord && 'z' in coord); };
export function IsCoord_4(coord : Types.T_Coord):coord is Types.T_Coord4D { return ('x' in coord && 'y' in coord && 'z' in coord && 'w' in coord); };

function FromCoord_ToVec_2(coord : Types.T_Coord2D): Vector.Types.T_Vec2D { return ([coord.x, coord.y]); };
function FromCoord_ToVec_3(coord : Types.T_Coord3D): Vector.Types.T_Vec3D { return ([coord.x, coord.y, coord.z]); };
function FromCoord_ToVec_4(coord : Types.T_Coord4D): Vector.Types.T_Vec4D { return ([coord.x, coord.y, coord.z, coord.w]); }
export function FromCoord_ToVec(coord : Types.T_Coord2D): Vector.Types.T_Vec2D
export function FromCoord_ToVec(coord : Types.T_Coord3D): Vector.Types.T_Vec3D
export function FromCoord_ToVec(coord : Types.T_Coord4D): Vector.Types.T_Vec4D
export function FromCoord_ToVec(coord : Types.T_Coord  ): Vector.Types.T_Vec
{
	if      (IsCoord_4(coord)) return (FromCoord_ToVec_4(coord));
	else if (IsCoord_3(coord)) return (FromCoord_ToVec_3(coord));
	else if (IsCoord_2(coord)) return (FromCoord_ToVec_2(coord));
	else                       return (coord);
};
