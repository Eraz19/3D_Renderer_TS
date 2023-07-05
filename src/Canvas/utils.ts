import * as Point    from "eraz-lib/build/Graphic/Point";
import * as Color    from "eraz-lib/build/Graphic/Color";
import * as Polygone from "eraz-lib/build/Graphic/Polygone";

import * as Types    from "./types";


function IsMatrix_2_2(matrix:Types.T_Matrix):matrix is Types.T_Matrix_2_2
{
	return (matrix.length === 2 && matrix[0].length === 2 && matrix[1].length === 2);
};
function IsMatrix_2_3(matrix:Types.T_Matrix):matrix is Types.T_Matrix_2_3
{
	return (matrix.length === 2 && matrix[0].length === 3 && matrix[1].length === 3);
};
function IsMatrix_3_3(matrix:Types.T_Matrix):matrix is Types.T_Matrix_3_3
{
	return (matrix.length === 3);
};
function IsMatrix_4_4(matrix:Types.T_Matrix):matrix is Types.T_Matrix_4_4
{
	return (matrix.length === 4);
};


function FillPixelBuffer_PointAsObj(
	buffer:Uint8ClampedArray,
	context:CanvasRenderingContext2D,
	point:Point.Types.T_ObjectLike,
	color:Color.RGB.Types.T_Color,
):void
{
	// We need to multiply by 4 the all surface because each pixel is encode on a RGBA palette
	const bufferIndex:number = (point.x + point.y * context.canvas.width) * 4;

	buffer[bufferIndex + 0] = color.red;
	buffer[bufferIndex + 1] = color.green;
	buffer[bufferIndex + 2] = color.blue;
	buffer[bufferIndex + 3] = 255;
};
function FillPixelBuffer_PointAsArr(
	buffer:Uint8ClampedArray,
	context:CanvasRenderingContext2D,
	point:Point.Types.T_ArrayLike,
	color:Color.RGB.Types.T_Color,
):void
{
	// We need to multiply by 4 the all surface because each pixel is encode on a RGBA palette
	const bufferIndex:number = (point[0] + point[1] * context.canvas.width) * 4;

	buffer[bufferIndex + 0] = color.red;
	buffer[bufferIndex + 1] = color.green;
	buffer[bufferIndex + 2] = color.blue;
	buffer[bufferIndex + 3] = 255;
};

export function FillPixelBuffer(
	buffer:Uint8ClampedArray,
	context:CanvasRenderingContext2D,
	point:Point.Types.T_ObjectLike,
	color:Color.RGB.Types.T_Color
):void
export function FillPixelBuffer(
	buffer:Uint8ClampedArray,
	context:CanvasRenderingContext2D,
	point:Point.Types.T_ArrayLike,
	color:Color.RGB.Types.T_Color,
):void
export function FillPixelBuffer(
	buffer:Uint8ClampedArray,
	context:CanvasRenderingContext2D,
	point:Point.Types.T_Point,
	color:Color.RGB.Types.T_Color,
):void
{
	if      (Point.Utils.IsPointArrayLike(point))  FillPixelBuffer_PointAsArr(buffer, context, point, color);
	else if (Point.Utils.IsPointObjectLike(point)) FillPixelBuffer_PointAsObj(buffer, context, point, color);
	else                                           return (point);
};


function FromCameraSpace_ToCanvas_PointAsObj(
	point:Point.Types.T_ObjectLike,
	canvasWidth:number,
	canvasHeight:number,
):Point.Types.T_ObjectLike
{
	const xOffset:number = Math.floor(canvasWidth  * .5);
	const yOffset:number = Math.floor(canvasHeight * .5);

	return ({ x: point.x - xOffset, y: -point.y + yOffset });
};
function FromCameraSpace_ToCanvas_PointAsArr(
	point:Point.Types.T_ArrayLike,
	canvasWidth:number,
	canvasHeight:number,
):Point.Types.T_ArrayLike
{
	const xOffset:number = Math.floor(canvasWidth  * .5);
	const yOffset:number = Math.floor(canvasHeight * .5);

	return ([point[0] - xOffset,-point[1] + yOffset]);
};

export function FromCameraSpace_ToCanvas(
	point:Point.Types.T_ObjectLike,
	canvasWidth:number,
	canvasHeight:number,
):Point.Types.T_ObjectLike
export function FromCameraSpace_ToCanvas(
	point:Point.Types.T_ArrayLike,
	canvasWidth:number,
	canvasHeight:number,
):Point.Types.T_ArrayLike
export function FromCameraSpace_ToCanvas(
	point:Point.Types.T_Point,
	canvasWidth:number,
	canvasHeight:number,
):Point.Types.T_Point
{
	if      (Point.Utils.IsPointArrayLike(point))  return (FromCameraSpace_ToCanvas_PointAsArr(point, canvasWidth, canvasHeight));
	else if (Point.Utils.IsPointObjectLike(point)) return (FromCameraSpace_ToCanvas_PointAsObj(point, canvasWidth, canvasHeight));
	else                                           return (point);
};


function IsLinePointCoord(line:string):boolean    { return (line.startsWith("v ")); };
function IsLinePolygonalFace(line:string):boolean { return (line.startsWith("f ")); };

function FromStringOBJ_ToPoint(str:string):Point.Types.T_ArrayLike3D
{
	const splitStr:string[] = str.split(' ').splice(1);

	if (splitStr.length >= 3) return ([Number(splitStr[0]),Number(splitStr[1]),Number(splitStr[2])]);
	else                      return ([NaN,NaN,NaN]);
};

function FromStringOBJ_ToPolygone(str:string, points:Point.Types.T_ArrayLike3D[]):Polygone.Types.T_Polygone3D
{
	function FromOBJPoligonalFace_ToVerticesIndex(str:string):number
	{
		const splitStr:string[] = str.split('/');

		if (splitStr.length >= 1) return (Number(splitStr[0]));
		else                      return (NaN);
	};
	function FromVerticesIndex_ToPolygone(verticesIndex:Point.Types.T_ArrayLike3D, points:Point.Types.T_ArrayLike3D[]):Polygone.Types.T_Polygone3D
	{
		let result:Point.Types.T_Point3D[] = [];

		for (const vertexIndex of verticesIndex)
		{
			if (vertexIndex - 1 < points.length) result = [...result, points[vertexIndex - 1]];
			else                                 result = [...result, [NaN,NaN,NaN]];
		}

		return (result as Polygone.Types.T_Polygone3D);
	};

	const splitStr:string[] = str.split(' ').splice(1);

	if (splitStr.length >= 3)
		return (FromVerticesIndex_ToPolygone(splitStr.map(FromOBJPoligonalFace_ToVerticesIndex) as Point.Types.T_ArrayLike3D, points));
	else
		return ([[NaN,NaN,NaN],[NaN,NaN,NaN],[NaN,NaN,NaN]]);
};

export function ParseOBJFile(fileContent:string):Polygone.Types.T_Polygone3D[]
{
	const splitLines:string[] = fileContent.split('\n');
	
	let pointStringList:string[]         = [];
	let polygonalFaceStringList:string[] = [];

	for (const line of splitLines)
	{
		if      (IsLinePointCoord(line))    pointStringList         = [...pointStringList        , line];
		else if (IsLinePolygonalFace(line)) polygonalFaceStringList = [...polygonalFaceStringList, line];
	}

	const points:Point.Types.T_ArrayLike3D[]      = pointStringList.map(FromStringOBJ_ToPoint);
	const polygones:Polygone.Types.T_Polygone3D[] = polygonalFaceStringList.map((str:string):Polygone.Types.T_Polygone3D =>
		{
			return (FromStringOBJ_ToPolygone(str, points));
		});

	return (polygones);
};


export function GenerateProjectionMatrixXY():Types.T_Matrix_2_3 { return ([[1,0,0],[0,1,0]]); };
export function GenerateProjectionMatrixXZ():Types.T_Matrix_2_3 { return ([[1,0,0],[0,0,1]]); };
export function GenerateProjectionMatrixYZ():Types.T_Matrix_2_3 { return ([[0,1,0],[0,0,1]]); };


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

function ApplyTransformation(matrix:Types.T_Matrix_2_3                    , point:Point.Types.T_Point3D):Point.Types.T_Point2D
function ApplyTransformation(matrix:Types.T_Matrix_3_3                    , point:Point.Types.T_Point3D):Point.Types.T_Point3D
function ApplyTransformation(matrix:Types.T_Matrix_2_3|Types.T_Matrix_3_3 , point:Point.Types.T_Point3D):Point.Types.T_Point
{
	if      (IsMatrix_2_3(matrix)) return (ApplyTransformation_2_3__3_1(matrix, point));
	else if (IsMatrix_3_3(matrix)) return (ApplyTransformation_3_3__3_1(matrix, point));
	else                           return (matrix);
};

function ApplyScaling(point:Point.Types.T_Point3D, scalingFactor:number):Point.Types.T_Point3D
{
	const originalPointX:number = Point.Utils.GetX(point);
	const originalPointY:number = Point.Utils.GetY(point);
	const originalPointZ:number = Point.Utils.GetZ(point);

	return ([originalPointX * scalingFactor, originalPointY * scalingFactor, originalPointZ * scalingFactor]);	
};

export function ProjectWorldView_ToCameraView(matrix:Types.T_Matrix_2_3, polygones:Polygone.Types.T_Polygone3D[]):Polygone.Types.T_Polygone2D[]
{
	let result:Polygone.Types.T_Polygone2D[] = [];

	for (const polygone of polygones)
	{
		let polygoneProjection:Polygone.Types.T_Polygone2D = [];

		for (const point of polygone)
			polygoneProjection = [...polygoneProjection, ApplyTransformation(matrix, point)];
		
		result = [...result, polygoneProjection];
	}

	return (result);
};


export function GenerateRotationMatrix(
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
};

export function MoveCamera(
	worldModel:Polygone.Types.T_Polygone3D[],
	scalingFactor:number,
	rotationMatrix:Types.T_Matrix_3_3,
):Polygone.Types.T_Polygone3D[]
{
	let result:Polygone.Types.T_Polygone3D[] = [];

	for (const polygone of worldModel)
	{
		let polygoneAfterCameraMovement:Polygone.Types.T_Polygone3D = [];

		for (const point of polygone)
			polygoneAfterCameraMovement = [...polygoneAfterCameraMovement, ApplyTransformation(rotationMatrix, ApplyScaling(point, scalingFactor))];
	
		result = [...result, polygoneAfterCameraMovement];
	}

	return (result);
};
