import * as Vector from "eraz-lib/build/Graphic/Vector";


export function IsVector_2_2(vector:number[]):vector is Vector.Types.T_2D { return (vector.length === 2); };
export function IsVector_3_3(vector:number[]):vector is Vector.Types.T_3D { return (vector.length === 3); };
export function IsVector_4_4(vector:number[]):vector is Vector.Types.T_4D { return (vector.length === 4); };


function Add_4_4(vector1:Vector.Types.T_4D, vector2:Vector.Types.T_4D):Vector.Types.T_4D
{
	return ([vector1[0] + vector2[0], vector1[1] + vector2[1], vector1[2] + vector2[2], vector1[3] + vector2[3]]);
};
function Add_3_3(vector1:Vector.Types.T_3D, vector2:Vector.Types.T_3D):Vector.Types.T_3D
{
	return ([vector1[0] + vector2[0], vector1[1] + vector2[1], vector1[2] + vector2[2]]);
};
function Add_2_2(vector1:Vector.Types.T_2D, vector2:Vector.Types.T_2D):Vector.Types.T_2D
{
	return ([vector1[0] + vector2[0], vector1[1] + vector2[1]]);
};
export function Add(vector1:Vector.Types.T_4D, vector2:Vector.Types.T_4D):Vector.Types.T_4D
export function Add(vector1:Vector.Types.T_3D, vector2:Vector.Types.T_3D):Vector.Types.T_3D
export function Add(vector1:Vector.Types.T_2D, vector2:Vector.Types.T_2D):Vector.Types.T_2D
export function Add(vector1:number[]         , vector2:number[]         ):number[]
{
	if      (IsVector_2_2(vector1) && IsVector_2_2(vector2)) return (Add_2_2(vector1, vector2));
	else if (IsVector_3_3(vector1) && IsVector_3_3(vector2)) return (Add_3_3(vector1, vector2));
	else if (IsVector_4_4(vector1) && IsVector_4_4(vector2)) return (Add_4_4(vector1, vector2));
	else                                                     return ([]);
};


function InverseVector_4_4(vector:Vector.Types.T_4D):Vector.Types.T_4D
{
	return ([-vector[0],-vector[1],-vector[2],-vector[3]]);
};
function InverseVector_3_3(vector:Vector.Types.T_3D):Vector.Types.T_3D
{
	return ([-vector[0],-vector[1],-vector[2]]);
};
function InverseVector_2_2(vector:Vector.Types.T_2D):Vector.Types.T_2D
{
	return ([-vector[0],-vector[1]]);
};
export function InverseVector(vector:Vector.Types.T_4D):Vector.Types.T_4D
export function InverseVector(vector:Vector.Types.T_3D):Vector.Types.T_3D
export function InverseVector(vector:Vector.Types.T_2D):Vector.Types.T_2D
export function InverseVector(vector:number[]         ):number[]
{
	if      (IsVector_2_2(vector)) return (InverseVector_2_2(vector));
	else if (IsVector_3_3(vector)) return (InverseVector_3_3(vector));
	else if (IsVector_4_4(vector)) return (InverseVector_4_4(vector));
	else                           return ([]);
};


function VectorNorm_4_4(vector:Vector.Types.T_4D):number { return (Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2] + vector[3] * vector[3])); };
function VectorNorm_3_3(vector:Vector.Types.T_3D):number { return (Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2])); };
function VectorNorm_2_2(vector:Vector.Types.T_2D):number { return (Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])); };
export function VectorNorm(vector:Vector.Types.T_4D):number
export function VectorNorm(vector:Vector.Types.T_3D):number
export function VectorNorm(vector:Vector.Types.T_2D):number
export function VectorNorm(vector:Vector.Types.T_4D|Vector.Types.T_3D|Vector.Types.T_2D):number
{

	if      (IsVector_4_4(vector)) return (VectorNorm_4_4(vector));
	else if (IsVector_3_3(vector)) return (VectorNorm_3_3(vector));
	else if (IsVector_2_2(vector)) return (VectorNorm_2_2(vector));
	else                           return (vector);
};