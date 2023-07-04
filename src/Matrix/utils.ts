import * as Point from "eraz-lib/build/Graphic/Point";
import * as Tuple from "eraz-lib/build/Primitive/Tuple";

import * as Types from "./types";

/*export function GenerateRotationMatrix(
	rotationAngleX:number,
	rotationAngleY:number,
	rotationAngleZ:number,
):Types.T_Matrix_3_3
{
	const value_1_1:number = Math.cos(rotationAngleY) * Math.cos(rotationAngleZ);
	const value_1_2:number = (-Math.cos(rotationAngleX) * Math.sin(rotationAngleZ)) + (Math.sin(rotationAngleX) * Math.sin(rotationAngleY) * Math.cos(rotationAngleZ));
	const value_1_3:number = (Math.sin(rotationAngleX) * Math.sin(rotationAngleZ)) + (Math.cos(rotationAngleX) * Math.sin(rotationAngleY) * Math.cos(rotationAngleZ));
	const value_2_1:number = Math.cos(rotationAngleY) * Math.sin(rotationAngleZ);
	const value_2_2:number = (Math.cos(rotationAngleX) * Math.cos(rotationAngleZ)) + (Math.sin(rotationAngleX) * Math.sin(rotationAngleY) * Math.sin(rotationAngleZ));
	const value_2_3:number = (-Math.sin(rotationAngleX) * Math.cos(rotationAngleZ)) + (Math.cos(rotationAngleX) * Math.sin(rotationAngleY) * Math.sin(rotationAngleZ));
	const value_3_1:number = -Math.sin(rotationAngleY);
	const value_3_2:number = Math.sin(rotationAngleX) * Math.cos(rotationAngleY);
	const value_3_3:number = Math.cos(rotationAngleX) * Math.cos(rotationAngleY);

	return (
		[
			[value_1_1,value_1_2,value_1_3],
			[value_2_1,value_2_2,value_2_3],
			[value_3_1,value_3_2,value_3_3],
		]
	);
};*/

export function PrintableMatrix(matrix:number[][]):string
{
	return (matrix.join("\n"));
};


export function IsMatrix_2_2(matrix:Types.T_Matrix):matrix is Types.T_Matrix_2_2
{
	return (matrix.length === 2 && matrix[0].length === 2 && matrix[1].length === 2);
};

export function IsMatrix_2_3(matrix:Types.T_Matrix):matrix is Types.T_Matrix_2_3
{
	return (matrix.length === 2 && matrix[0].length === 3 && matrix[1].length === 3);
};

export function IsMatrix_3_3(matrix:Types.T_Matrix):matrix is Types.T_Matrix_3_3
{
	return (matrix.length === 3);
};

export function IsMatrix_4_4(matrix:Types.T_Matrix):matrix is Types.T_Matrix_4_4
{
	return (matrix.length === 4);
};


export function GenerateProjectionMatrixXY():Types.T_Matrix_2_3 { return ([[1,0,0],[0,1,0]]); };
export function GenerateProjectionMatrixXZ():Types.T_Matrix_2_3 { return ([[1,0,0],[0,0,1]]); };
export function GenerateProjectionMatrixYZ():Types.T_Matrix_2_3 { return ([[0,1,0],[0,0,1]]); };


function ApplyTransformation_4_4__4_1(matrix:Types.T_Matrix_4_4, point:Point.Types.T_Point4D):Point.Types.T_Point4D
{
	const originalPointX:number = Point.Utils.GetX(point);
	const originalPointY:number = Point.Utils.GetY(point);
	const originalPointZ:number = Point.Utils.GetZ(point);
	const originalPointW:number = Point.Utils.GetW(point);

	const x:number = (matrix[0][0] * originalPointX) + (matrix[0][1] * originalPointY) + (matrix[0][2] * originalPointZ) + matrix[0][3];
	const y:number = (matrix[1][0] * originalPointX) + (matrix[1][1] * originalPointY) + (matrix[1][2] * originalPointZ) + matrix[1][3];
	const z:number = (matrix[2][0] * originalPointX) + (matrix[2][1] * originalPointY) + (matrix[2][2] * originalPointZ) + matrix[2][3];

	return ([x,y,z,originalPointW]);
};
function ApplyTransformation_2_3__3_1(matrix:Types.T_Matrix_2_3, point:Point.Types.T_Point3D):Point.Types.T_Point2D
{
	const originalPointX:number = Point.Utils.GetX(point);
	const originalPointY:number = Point.Utils.GetY(point);
	const originalPointZ:number = Point.Utils.GetZ(point);

	const newPointX:number = (matrix[0][0] * originalPointX) + (matrix[0][1] * originalPointY) + (matrix[0][2] * originalPointZ);
	const newPointY:number = (matrix[1][0] * originalPointX) + (matrix[1][1] * originalPointY) + (matrix[1][2] * originalPointZ);

	return ([newPointX,newPointY]);
};
function ApplyTransformation_3_3__3_1(matrix:Types.T_Matrix_3_3, point:Point.Types.T_Point3D):Point.Types.T_Point3D
{
	const originalPointX:number = Point.Utils.GetX(point);
	const originalPointY:number = Point.Utils.GetY(point);
	const originalPointZ:number = Point.Utils.GetZ(point);

	const newPointX:number = (matrix[0][0] * originalPointX) + (matrix[0][1] * originalPointY) + (matrix[0][2] * originalPointZ);
	const newPointY:number = (matrix[1][0] * originalPointX) + (matrix[1][1] * originalPointY) + (matrix[1][2] * originalPointZ);
	const newPointZ:number = (matrix[2][0] * originalPointX) + (matrix[2][1] * originalPointY) + (matrix[2][2] * originalPointZ);

	return ([newPointX,newPointY,newPointZ]);
};
export function ApplyTransformation(matrix:Types.T_Matrix_2_3                                      , point:Point.Types.T_Point3D                      ):Point.Types.T_Point2D
export function ApplyTransformation(matrix:Types.T_Matrix_3_3                                      , point:Point.Types.T_Point3D                      ):Point.Types.T_Point3D
export function ApplyTransformation(matrix:Types.T_Matrix_4_4                                      , point:Point.Types.T_Point4D                      ):Point.Types.T_Point4D
export function ApplyTransformation(matrix:Types.T_Matrix_2_3|Types.T_Matrix_3_3|Types.T_Matrix_4_4, point:Point.Types.T_Point3D|Point.Types.T_Point4D):Point.Types.T_Point
{
	if      (IsMatrix_2_3(matrix) && Point.Utils.IsPoint3D(point)) return (ApplyTransformation_2_3__3_1(matrix, point));
	else if (IsMatrix_3_3(matrix) && Point.Utils.IsPoint3D(point)) return (ApplyTransformation_3_3__3_1(matrix, point));
	else if (IsMatrix_4_4(matrix) && Point.Utils.IsPoint4D(point)) return (ApplyTransformation_4_4__4_1(matrix, point));
	else                                                           return (point);
};


export function ApplyScaling(point:Point.Types.T_Point3D, scalingFactor:number):Point.Types.T_Point3D
{
	const originalPointX:number = Point.Utils.GetX(point);
	const originalPointY:number = Point.Utils.GetY(point);
	const originalPointZ:number = Point.Utils.GetZ(point);

	return ([originalPointX * scalingFactor, originalPointY * scalingFactor, originalPointZ * scalingFactor]);	
};


/*function Inverse_2_2(matrix:Types.T_Matrix_2_2, det:number):Types.T_Matrix_2_2 { return (ScalarMult(Transpose(Comatrix(matrix)), 1 / det)); };
function Inverse_3_3(matrix:Types.T_Matrix_3_3, det:number):Types.T_Matrix_3_3 { return (ScalarMult(Transpose(Comatrix(matrix)), 1 / det)); };
export function Inverse(matrix:Types.T_Matrix_2_2                              , det:number):Types.T_Matrix_2_2
export function Inverse(matrix:Types.T_Matrix_3_3                              , det:number):Types.T_Matrix_3_3
export function Inverse(matrix:Exclude<Types.T_SquareMatrix,Types.T_Matrix_4_4>, det:number):Exclude<Types.T_SquareMatrix,Types.T_Matrix_4_4>
{
	if      (IsMatrix_2_2(matrix)) return (Inverse_2_2(matrix, det));
	else if (IsMatrix_3_3(matrix)) return (Inverse_3_3(matrix, det));
	else
	{
		const neverHapperns:never = matrix;

		return (neverHapperns);	
	}
};*/


function ExtendMatrix(matrix:number[][], order:number):number[][]
{
	let result:number[][] = [];

	for (let i:number = 0; i < order; ++i)
	{
		let rowValues:number[] = [...matrix[i]];

		for (let j:number = order; j < (order * 2); ++j)
		{
			if ((i + order) === j) rowValues = [...rowValues, 1];
			else                   rowValues = [...rowValues, 0];
		}

		result = [...result, rowValues];
	}

	return (result);
};

function FindFirstNonZeroValueIndexInColumn(matrix:number[][], columnIndex:number, order:number):number
{
	for (let row:number = columnIndex; row < order; ++row)
	{
		if (matrix[row][columnIndex] !== 0)
			return (row);
	}

	return (-1);
};

function SwapRows(matrix:number[][], rowToSwap:number, targetRow:number):void
{
	let tempRow:number[];

	tempRow           = matrix[rowToSwap];
	matrix[rowToSwap] = matrix[targetRow];
	matrix[targetRow] = tempRow;
};

function NormalizePivot(matrix:number[][], columnIndex:number, order:number):void
{
	const pivotValue:number = matrix[columnIndex][columnIndex];

	for (let column:number = columnIndex; column < order * 2; ++column)
		matrix[columnIndex][column] /= pivotValue;
};

function OrthogonalizePivot(matrix:number[][], currentColumnIndex:number, order:number):void
{
	for (let row:number = 0; row < order; ++row)
	{
		if (row !== currentColumnIndex)
		{
			const factor:number             = matrix[row][currentColumnIndex];
			const matrixRowContent:number[] = [...matrix[currentColumnIndex]];

			matrix[row] = matrix[row].map((rowElem:number, columnIndex:number):number =>
			{
				return (rowElem - (matrixRowContent[columnIndex] * factor));
			});
		}
	}
};

function ExtractInverseMatrixFromExtendedMatrix(matrix:number[][], order:number):number[][]
{
	let result:number[][] = [];

	for (let row:number = 0; row < order; ++row)
		result = [...result, matrix[row].slice(4)];

	return (result);
};

export function InverseMatrix(matrix:Types.T_Matrix_4_4, order:4):Types.T_Matrix_4_4
export function InverseMatrix(matrix:Types.T_Matrix_3_3, order:3):Types.T_Matrix_3_3
export function InverseMatrix(matrix:Types.T_Matrix_2_2, order:2):Types.T_Matrix_2_2
export function InverseMatrix(matrix:number[][], order:number):number[][]
{
	let result:number[][] = ExtendMatrix(matrix, order);

	for (let column:number = 0; column < order; ++column)
	{
		const rowIndex:number = FindFirstNonZeroValueIndexInColumn(result, column, order);

		SwapRows          (result, rowIndex, column);
		NormalizePivot    (result, column  , order );
		OrthogonalizePivot(result, column  , order );
	}

	return (ExtractInverseMatrixFromExtendedMatrix(result, order));
};
