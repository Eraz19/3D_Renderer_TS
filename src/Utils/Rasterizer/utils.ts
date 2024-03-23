import * as Matrix from "../Matrix";
import * as Vector from "../Vector";


function Transformation_3_3(
	vector : Vector.Types.T_Vec3D,
	matrix : Matrix.Types.T_Matrix_3_3,
): void
{
	const newVectorX : number = (matrix[1][0] * vector[0]) + (matrix[1][1] * vector[1]) + (matrix[1][2] * vector[2]);
	const newVectorY : number = (matrix[0][0] * vector[0]) + (matrix[0][1] * vector[1]) + (matrix[0][2] * vector[2]);
	const newVectorZ : number = (matrix[2][0] * vector[0]) + (matrix[2][1] * vector[1]) + (matrix[2][2] * vector[2]);

	vector[0] = newVectorX;
	vector[1] = newVectorY;
	vector[2] = newVectorZ;
};

function Add_3(
	vector1 : Vector.Types.T_Vec3D,
	vector2 : Vector.Types.T_Vec3D,
): void
{
	vector1[0] = vector1[0] + vector2[0];
	vector1[1] = vector1[1] + vector2[1];
	vector1[2] = vector1[2] + vector2[2];
};

export function CenterDisplayOrigin(
	vertex        : Vector.Types.T_Vec3D,
	displayWidth  : number,
	displayHeight : number,
) : void
{
	vertex[0] = Math.floor(vertex[0]  + displayWidth  * .5);
	vertex[1] = Math.floor(-vertex[1] + displayHeight * .5);
};

export function FromCameraSpace_ToDisplaySpace(
	vertex       : Vector.Types.T_Vec3D,
	cameraRadius : number,
) : void
{
	Transformation_3_3(vertex, [[0,cameraRadius,0],[0,0,cameraRadius],[cameraRadius,0,0]]);
};

function FromWorldSpace_ToCameraSpace(
	vertex                   : Vector.Types.T_Vec3D,
	scalingAndRotationMatrix : Matrix.Types.T_Matrix_3_3,
	translationVector        : Vector.Types.T_Vec3D,
) : void
{
	Transformation_3_3(vertex, scalingAndRotationMatrix);
	Add_3             (vertex, translationVector       );
};

export function FromWorldSpace_ToDisplaySpace(
	vertices                 : Vector.Types.T_Vec3D[],
	scalingAndRotationMatrix : Matrix.Types.T_Matrix_3_3,
	translationVector        : Vector.Types.T_Vec3D,
	cameraRadius             : number,
	displayWidth             : number,
	displayHeight            : number,
): Vector.Types.T_Vec3D[]
{
	return (
		vertices.map((vertex : Vector.Types.T_Vec3D): Vector.Types.T_Vec3D =>
		{
			let result : Vector.Types.T_Vec3D = [...vertex];

			FromWorldSpace_ToCameraSpace  (result, scalingAndRotationMatrix, translationVector);
			FromCameraSpace_ToDisplaySpace(result, cameraRadius                               );
			CenterDisplayOrigin           (result, displayWidth            , displayHeight    );

			return (result);
		})
	);
};
