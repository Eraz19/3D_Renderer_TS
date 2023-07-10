import * as Types  from "./types";
import * as Vector from "../Vector";
import * as Coord  from "../Coord";


//export function GenerateProjectionMatrixXY():Types.T_Matrix_2_3 { return ([[1,0,0],[0,1,0]]); };
//export function GenerateProjectionMatrixXZ():Types.T_Matrix_2_3 { return ([[1,0,0],[0,0,1]]); };
//export function GenerateProjectionMatrixYZ():Types.T_Matrix_2_3 { return ([[0,1,0],[0,0,1]]); };

export function IsMatrix_2_2(matrix : Types.T_Matrix):matrix is Types.T_Matrix_2_2 { return (matrix.length === 2 && matrix[0].length === 2 && matrix[1].length === 2); };
export function IsMatrix_2_3(matrix : Types.T_Matrix):matrix is Types.T_Matrix_2_3 { return (matrix.length === 2 && matrix[0].length === 3 && matrix[1].length === 3); };
export function IsMatrix_3_3(matrix : Types.T_Matrix):matrix is Types.T_Matrix_3_3 { return (matrix.length === 3); };
export function IsMatrix_4_4(matrix : Types.T_Matrix):matrix is Types.T_Matrix_4_4 { return (matrix.length === 4); };

function Transformation_2_2__Coord2(
	matrix : Types.T_Matrix_2_2,
	coord  : Coord.Types.T_Coord2D,
): Coord.Types.T_Coord2D
{
	return (
		{
			x: (matrix[0][0] * coord.x) + (matrix[0][1] * coord.y),
			y: (matrix[1][0] * coord.x) + (matrix[1][1] * coord.y),
		}
	);
};
function Transformation_2_2__Vec2(
	matrix : Types.T_Matrix_2_2,
	vector : Vector.Types.T_Vec2D,
): Vector.Types.T_Vec2D
{
	return (
		[
			(matrix[0][0] * vector[0]) + (matrix[0][1] * vector[1]),
			(matrix[1][0] * vector[0]) + (matrix[1][1] * vector[1]),
		]
	);
};
function Transformation_2_3__Coord3(
	matrix : Types.T_Matrix_2_3,
	coord  : Coord.Types.T_Coord3D,
): Coord.Types.T_Coord2D
{	
	return (
		{
			x: (matrix[0][0] * coord.x) + (matrix[0][1] * coord.y) + (matrix[0][2] * coord.z),
			y: (matrix[1][0] * coord.x) + (matrix[1][1] * coord.y) + (matrix[1][2] * coord.z),
		}
	);
};
function Transformation_2_3__Vec3(
	matrix : Types.T_Matrix_2_3,
	vector : Vector.Types.T_Vec3D,
): Vector.Types.T_Vec2D
{	
	return (
		[
			(matrix[0][0] * vector[0]) + (matrix[0][1] * vector[1]) + (matrix[0][2] * vector[2]),
			(matrix[1][0] * vector[0]) + (matrix[1][1] * vector[1]) + (matrix[1][2] * vector[2]),
		]
	);
};
function Transformation_3_3__Coord3(
	matrix : Types.T_Matrix_3_3,
	coord  : Coord.Types.T_Coord3D,
): Coord.Types.T_Coord3D
{
	return (
		{
			x: (matrix[0][0] * coord.x) + (matrix[0][1] * coord.y) + (matrix[0][2] * coord.z),
			y: (matrix[1][0] * coord.x) + (matrix[1][1] * coord.y) + (matrix[1][2] * coord.z),
			z: (matrix[2][0] * coord.x) + (matrix[2][1] * coord.y) + (matrix[2][2] * coord.z),
		}
	);
};
function Transformation_3_3__Vec3(
	matrix : Types.T_Matrix_3_3,
	vector : Vector.Types.T_Vec3D,
): Vector.Types.T_Vec3D
{
	return (
		[
			(matrix[0][0] * vector[0]) + (matrix[0][1] * vector[1]) + (matrix[0][2] * vector[2]),
			(matrix[1][0] * vector[0]) + (matrix[1][1] * vector[1]) + (matrix[1][2] * vector[2]),
			(matrix[2][0] * vector[0]) + (matrix[2][1] * vector[1]) + (matrix[2][2] * vector[2]),
		]
	);
};
// This matrix transformation is specificly the the application of the homogenius matrix
function Transformation_4_4__Coord4(
	matrix : Types.T_Matrix_4_4,
	coord  : Coord.Types.T_Coord4D,
): Coord.Types.T_Coord4D
{
	return (
		{
			x: (matrix[0][0] * coord.x) + (matrix[0][1] * coord.y) + (matrix[0][2] * coord.z) + matrix[0][3],
			y: (matrix[1][0] * coord.x) + (matrix[1][1] * coord.y) + (matrix[1][2] * coord.z) + matrix[1][3],
			z: (matrix[2][0] * coord.x) + (matrix[2][1] * coord.y) + (matrix[2][2] * coord.z) + matrix[2][3],
			w: coord.w,
		}
	);
};
function Transformation_4_4__Vec4(
	matrix : Types.T_Matrix_4_4,
	vector : Vector.Types.T_Vec4D,
): Vector.Types.T_Vec4D
{
	return (
		[
			(matrix[0][0] * vector[0]) + (matrix[0][1] * vector[1]) + (matrix[0][2] * vector[2]) + matrix[0][3],
			(matrix[1][0] * vector[0]) + (matrix[1][1] * vector[1]) + (matrix[1][2] * vector[2]) + matrix[1][3],
			(matrix[2][0] * vector[0]) + (matrix[2][1] * vector[1]) + (matrix[2][2] * vector[2]) + matrix[2][3],
			vector[3],
		]
	);
};
export function Transformation(
	matrix : Types.T_Matrix_2_2,
	vector : Vector.Types.T_Vec2D,
): Vector.Types.T_Vec2D
export function Transformation(
	matrix : Types.T_Matrix_2_2,
	coord  : Coord.Types.T_Coord2D,
): Coord.Types.T_Coord2D
export function Transformation(
	matrix : Types.T_Matrix_2_3,
	vector : Vector.Types.T_Vec3D,
): Vector.Types.T_Vec2D
export function Transformation(
	matrix : Types.T_Matrix_2_3,
	coord  : Coord.Types.T_Coord3D,
): Coord.Types.T_Coord2D
export function Transformation(
	matrix : Types.T_Matrix_3_3,
	vector : Vector.Types.T_Vec3D,
): Vector.Types.T_Vec3D
export function Transformation(
	matrix : Types.T_Matrix_3_3,
	coord  : Coord.Types.T_Coord3D,
): Coord.Types.T_Coord3D
export function Transformation(
	matrix : Types.T_Matrix_4_4,
	vector : Vector.Types.T_Vec4D,
): Vector.Types.T_Vec4D
export function Transformation(
	matrix : Types.T_Matrix_4_4,
	coord  : Coord.Types.T_Coord4D,
): Coord.Types.T_Coord4D
export function Transformation(
	matrix : Types.T_Matrix,
	value  : Vector.Types.T_Vec|Coord.Types.T_Coord,
): Vector.Types.T_Vec|Coord.Types.T_Coord
{
	function Transformation_2_2(
		matrix : Types.T_Matrix_2_2,
		value  : Vector.Types.T_Vec|Coord.Types.T_Coord,
	): Vector.Types.T_Vec2D|Coord.Types.T_Coord2D
	{
		if (Array.isArray(value))
		{
			if (Vector.Utils.IsVector_2(value))	return (Transformation_2_2__Vec2(matrix, value));
			else                                return ({} as never);
		}
		else
		{
			if (Coord.Utils.IsCoord_2(value)) return (Transformation_2_2__Coord2(matrix, value));
			else                              return ({} as never);
		}
	};
	function Transformation_2_3(
		matrix : Types.T_Matrix_2_3,
		value  : Vector.Types.T_Vec|Coord.Types.T_Coord,
	): Vector.Types.T_Vec2D|Coord.Types.T_Coord2D
	{
		if (Array.isArray(value))
		{
			if (Vector.Utils.IsVector_3(value))	return (Transformation_2_3__Vec3(matrix, value));
			else                                return ({} as never);
		}
		else
		{
			if (Coord.Utils.IsCoord_3(value)) return (Transformation_2_3__Coord3(matrix, value));
			else                              return ({} as never);
		}
	};
	function Transformation_3_3(
		matrix : Types.T_Matrix_3_3,
		value  : Vector.Types.T_Vec|Coord.Types.T_Coord,
	): Vector.Types.T_Vec3D|Coord.Types.T_Coord3D
	{
		if (Array.isArray(value))
		{
			if (Vector.Utils.IsVector_3(value))	return (Transformation_3_3__Vec3(matrix, value));
			else                                return ({} as never);
		}
		else
		{
			if (Coord.Utils.IsCoord_3(value)) return (Transformation_3_3__Coord3(matrix, value));
			else                              return ({} as never);
		}
	};
	function Transformation_4_4(
		matrix : Types.T_Matrix_4_4,
		value  : Vector.Types.T_Vec|Coord.Types.T_Coord,
	): Vector.Types.T_Vec4D|Coord.Types.T_Coord4D
	{
		if (Array.isArray(value))
		{
			if (Vector.Utils.IsVector_4(value))	return (Transformation_4_4__Vec4(matrix, value));
			else                                return ({} as never);
		}
		else
		{
			if (Coord.Utils.IsCoord_4(value)) return (Transformation_4_4__Coord4(matrix, value));
			else                              return ({} as never);
		}
	};

	if      (IsMatrix_2_2(matrix)) return (Transformation_2_2(matrix, value));
	else if (IsMatrix_2_3(matrix)) return (Transformation_2_3(matrix, value));
	else if (IsMatrix_3_3(matrix)) return (Transformation_3_3(matrix, value));
	else if (IsMatrix_4_4(matrix)) return (Transformation_4_4(matrix, value));
	else                           return ({} as never);
};

export function InverseMatrix(
	matrix : Types.T_Matrix_2_2,
	order  : 2,
): Types.T_Matrix_2_2
export function InverseMatrix(
	matrix : Types.T_Matrix_3_3,
	order  : 3,
): Types.T_Matrix_3_3
export function InverseMatrix(
	matrix : Types.T_Matrix_4_4,
	order  : 4,
): Types.T_Matrix_4_4
export function InverseMatrix(
	matrix : number[][],
	order  : number,
): number[][]
{
	function ExtendMatrix(
		matrix : number[][],
		order  : number,
	): number[][]
	{
		let result : number[][] = [];
	
		for (let i : number = 0; i < order; ++i)
		{
			let rowValues : number[] = [...matrix[i]];
	
			for (let j : number = order; j < (order * 2); ++j)
			{
				if ((i + order) === j) rowValues = [...rowValues, 1];
				else                   rowValues = [...rowValues, 0];
			}
	
			result = [...result, rowValues];
		}
	
		return (result);
	};
	function FindFirstNonZeroValueIndexInColumn(
		matrix      : number[][],
		columnIndex : number,
		order       : number,
	): number
	{
		for (let row : number = columnIndex; row < order; ++row)
		{
			if (matrix[row][columnIndex] !== 0)
				return (row);
		}
	
		return (-1);
	};
	function SwapRows(
		matrix    : number[][],
		rowToSwap : number,
		targetRow : number,
	): void
	{
		let tempRow : number[];
	
		tempRow           = matrix[rowToSwap];
		matrix[rowToSwap] = matrix[targetRow];
		matrix[targetRow] = tempRow;
	};
	function NormalizePivot(
		matrix      : number[][],
		columnIndex : number,
		order       : number,
	): void
	{
		const pivotValue : number = matrix[columnIndex][columnIndex];
	
		for (let column : number = columnIndex; column < order * 2; ++column)
			matrix[columnIndex][column] /= pivotValue;
	};
	function OrthogonalizePivot(
		matrix             : number[][],
		currentColumnIndex : number,
		order              : number,
	): void
	{
		for (let row : number = 0; row < order; ++row)
		{
			if (row !== currentColumnIndex)
			{
				const factor           : number   = matrix[row][currentColumnIndex];
				const matrixRowContent : number[] = [...matrix[currentColumnIndex]];
	
				matrix[row] = matrix[row].map((rowElem : number, columnIndex : number): number =>
				{
					return (rowElem - (matrixRowContent[columnIndex] * factor));
				});
			}
		}
	};
	function ExtractInverseMatrixFromExtendedMatrix(
		matrix : number[][],
		order  : number,
	): number[][]
	{
		let result : number[][] = [];
	
		for (let row : number = 0; row < order; ++row)
			result = [...result, matrix[row].slice(4)];
	
		return (result);
	};

	let result : number[][] = ExtendMatrix(matrix, order);

	for (let column : number = 0; column < order; ++column)
	{
		const rowIndex : number = FindFirstNonZeroValueIndexInColumn(result, column, order);

		SwapRows          (result, rowIndex, column);
		NormalizePivot    (result, column  , order );
		OrthogonalizePivot(result, column  , order );
	}

	return (ExtractInverseMatrixFromExtendedMatrix(result, order));
};
