import * as Types from "./types";
import * as Coord from "../Coord";


export function IsVector_2(vector : Types.T_Vec):vector is Types.T_Vec2D { return (vector.length === 2); };
export function IsVector_3(vector : Types.T_Vec):vector is Types.T_Vec3D { return (vector.length === 3); };
export function IsVector_4(vector : Types.T_Vec):vector is Types.T_Vec4D { return (vector.length === 4); };

function FromVec_ToCoord_2(vector : Types.T_Vec2D): Coord.Types.T_Coord2D { return ({ x: vector[0], y: vector[1] }); };
function FromVec_ToCoord_3(vector : Types.T_Vec3D): Coord.Types.T_Coord3D { return ({ x: vector[0], y: vector[1], z: vector[2] }); };
export function FromVec_ToCoord(vector : Types.T_Vec2D              ): Coord.Types.T_Coord2D
export function FromVec_ToCoord(vector : Types.T_Vec3D              ): Coord.Types.T_Coord3D
export function FromVec_ToCoord(vector : Types.T_Vec2D|Types.T_Vec3D): Coord.Types.T_Coord2D|Coord.Types.T_Coord3D
{
	if      (IsVector_2(vector)) return (FromVec_ToCoord_2(vector));
	else if (IsVector_3(vector)) return (FromVec_ToCoord_3(vector));
	else                         return (vector);
};

function Add_2(
	vector1 : Types.T_Vec2D,
	vector2 : Types.T_Vec2D,
): Types.T_Vec2D
{
	return ([vector1[0] + vector2[0], vector1[1] + vector2[1]]);
};
function Add_3(
	vector1 : Types.T_Vec3D,
	vector2 : Types.T_Vec3D,
): Types.T_Vec3D
{
	return ([vector1[0] + vector2[0], vector1[1] + vector2[1], vector1[2] + vector2[2]]);
};
function Add_4(
	vector1 : Types.T_Vec4D,
	vector2 : Types.T_Vec4D,
): Types.T_Vec4D
{
	return ([vector1[0] + vector2[0], vector1[1] + vector2[1], vector1[2] + vector2[2], vector1[3] + vector2[3]]);
};
export function Add(
	vector1 : Types.T_Vec2D,
	vector2 : Types.T_Vec2D,
): Types.T_Vec2D
export function Add(
	vector1 : Types.T_Vec3D,
	vector2 : Types.T_Vec3D,
): Types.T_Vec3D
export function Add(
	vector1 : Types.T_Vec4D,
	vector2 : Types.T_Vec4D,
): Types.T_Vec4D
export function Add(
	vector1 : Types.T_Vec,
	vector2 : Types.T_Vec,
): Types.T_Vec
{
	if      (IsVector_2(vector1) && IsVector_2(vector2)) return (Add_2(vector1, vector2));
	else if (IsVector_3(vector1) && IsVector_3(vector2)) return (Add_3(vector1, vector2));
	else if (IsVector_4(vector1) && IsVector_4(vector2)) return (Add_4(vector1, vector2));
	else                                                 return ({} as never);
};

function Inverse_2(vector : Types.T_Vec2D): Types.T_Vec2D { return ([-vector[0],-vector[1]]); };
function Inverse_3(vector : Types.T_Vec3D): Types.T_Vec3D { return ([-vector[0],-vector[1],-vector[2]]); };
function Inverse_4(vector : Types.T_Vec4D): Types.T_Vec4D { return ([-vector[0],-vector[1],-vector[2],-vector[3]]); };
export function Inverse(vector : Types.T_Vec2D): Types.T_Vec2D
export function Inverse(vector : Types.T_Vec3D): Types.T_Vec3D
export function Inverse(vector : Types.T_Vec4D): Types.T_Vec4D
export function Inverse(vector : Types.T_Vec  ): Types.T_Vec
{
	if      (IsVector_2(vector)) return (Inverse_2(vector));
	else if (IsVector_3(vector)) return (Inverse_3(vector));
	else if (IsVector_4(vector)) return (Inverse_4(vector));
	else                         return (vector);
};

function Norm_2(vector : Types.T_Vec2D): number { return (Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])); };
function Norm_3(vector : Types.T_Vec3D): number { return (Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2])); };
function Norm_4(vector : Types.T_Vec4D): number { return (Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2] + vector[3] * vector[3])); };
export function Norm(vector : Types.T_Vec2D): number
export function Norm(vector : Types.T_Vec3D): number
export function Norm(vector : Types.T_Vec4D): number
export function Norm(vector : Types.T_Vec  ): number
{
	if      (IsVector_2(vector)) return (Norm_2(vector));
	else if (IsVector_3(vector)) return (Norm_3(vector));
	else if (IsVector_4(vector)) return (Norm_4(vector));
	else                         return ({} as never);
};

function Scale_2(
	vector        : Types.T_Vec2D,
	scalingFactor : number,
): Types.T_Vec2D
{
	return ([vector[0] * scalingFactor, vector[1] * scalingFactor]);
};
function Scale_3(
	vector        : Types.T_Vec3D,
	scalingFactor : number,
): Types.T_Vec3D
{
	return ([vector[0] * scalingFactor, vector[1] * scalingFactor, vector[2] * scalingFactor]);
};
function Scale_4(
	vector        : Types.T_Vec4D,
	scalingFactor : number,
): Types.T_Vec4D
{
	return ([vector[0] * scalingFactor, vector[1] * scalingFactor, vector[2] * scalingFactor, vector[3] * scalingFactor]);
};
export function Scale(
	vector        : Types.T_Vec2D,
	scalingFactor : number,
): Types.T_Vec2D
export function Scale(
	vector        : Types.T_Vec3D,
	scalingFactor : number,
): Types.T_Vec3D
export function Scale(
	vector        : Types.T_Vec4D,
	scalingFactor : number,
): Types.T_Vec4D
export function Scale(
	vector        : Types.T_Vec,
	scalingFactor : number,
): Types.T_Vec
{
	if      (IsVector_2(vector)) return (Scale_2(vector, scalingFactor));
	else if (IsVector_3(vector)) return (Scale_3(vector, scalingFactor));
	else if (IsVector_4(vector)) return (Scale_4(vector, scalingFactor));
	else                         return ({} as never);
};

export function CrossProduct(
	vector1 : Types.T_Vec3D,
	vector2 : Types.T_Vec3D,
): Types.T_Vec3D
{
	return (
		[
			(vector1[1] * vector2[2]) - (vector2[1] * vector1[2]),
			(vector1[2] * vector2[0]) - (vector2[2] * vector1[0]),
			(vector1[0] * vector2[1]) - (vector2[0] * vector1[1]),
		]
	);
};

function Normalize_2(vector : Types.T_Vec2D): Types.T_Vec2D
{
	const factor : number = 1. / Norm(vector);

	return ([vector[0] * factor, vector[1] * factor]);
};
function Normalize_3(vector : Types.T_Vec3D): Types.T_Vec3D
{
	const factor : number = 1. / Norm(vector);

	return ([vector[0] * factor, vector[1] * factor, vector[2] * factor]);
};
export function Normalize(vector : Types.T_Vec2D              ): Types.T_Vec2D
export function Normalize(vector : Types.T_Vec3D              ): Types.T_Vec3D
export function Normalize(vector : Types.T_Vec2D|Types.T_Vec3D): Types.T_Vec2D|Types.T_Vec3D
{
	if      (IsVector_2(vector)) return (Normalize_2(vector));
	else if (IsVector_3(vector)) return (Normalize_3(vector));
	else                         return (vector);
};
