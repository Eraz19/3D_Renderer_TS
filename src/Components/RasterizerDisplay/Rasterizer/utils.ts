import * as Polygone   from "../../../Utils/Shapes/Polygone";
import * as Line       from "../../../Utils/Shapes/Line";
import * as Rasterizer from "../../../Utils/Rasterizer";
import * as Matrix     from "../../../Utils/Matrix";
import * as Coord      from "../../../Utils/Coord";
import * as Color      from "../../../Utils/Color";
import * as Vector     from "../../../Utils/Vector";

import * as Types from "./types";


function FillPixelBuffer(
	buffer  : Uint8ClampedArray,
	context : CanvasRenderingContext2D,
	coord   : Coord.Types.T_Coord2D,
	color   : Color.RGB.Types.T_Color,
): void
{
	// We need to multiply by 4 the all surface because each pixel is encode on a RGBA palette
	const bufferIndex : number = (coord.x + coord.y * context.canvas.width) * 4;

	if (bufferIndex >= 0 && bufferIndex <= buffer.length - 4)
	{
		buffer[bufferIndex + 0] = color.red;
		buffer[bufferIndex + 1] = color.green;
		buffer[bufferIndex + 2] = color.blue;
		buffer[bufferIndex + 3] = 255;
	}
};

function FillCanvasBackground(
	buffer  : Uint8ClampedArray,
	context : CanvasRenderingContext2D,
	color   : Color.RGB.Types.T_Color,
) : void
{
	for (let i : number = 0; i <= context.canvas.height; ++i)
	{
		for (let j : number = 0; j <= context.canvas.width; ++j)
			FillPixelBuffer(buffer, context, { x: j, y: i }, color);
	}
};

function DrawCoordSystemOnCanvas(
	buffer                : Uint8ClampedArray,
	context               : CanvasRenderingContext2D,
	coordinateSystemBases : Rasterizer.Types.T_CoordinateBases_3D,
	camera                : Rasterizer.PolarCamera.Types.T_PolarCamera,
): void
{
	function DrawLinePointsOnCanvas(
		linePointsCoord : Coord.Types.T_Coord2D[],
		color           : Color.RGB.Types.T_Color,
	): void
	{
		linePointsCoord.map((linePointCoord:Coord.Types.T_Coord2D): void =>
		{
			FillPixelBuffer(
				buffer,
				context,
				Rasterizer.Utils.CenterDisplayOrigin(linePointCoord, context.canvas.width, context.canvas.height),
				color,
			);
		});	
	};

	function DrawLineOnCanvas(
		line    : Line.Types.T_Line3D,
		color   : Color.RGB.Types.T_Color,
	): void
	{
		const lineStartCoord  : Coord.Types.T_Coord2D   = Rasterizer.Utils.FromCameraSpace_ToDisplaySpace_Coord(line.start, camera.polarCoord.radius);
		const lineEndCoord 	  : Coord.Types.T_Coord2D   = Rasterizer.Utils.FromCameraSpace_ToDisplaySpace_Coord(line.end  , camera.polarCoord.radius);
		const linePointsCoord : Coord.Types.T_Coord2D[] = Line.Utils.GetLinePointsCoord({ start: lineStartCoord, end: lineEndCoord });

		DrawLinePointsOnCanvas(linePointsCoord, color);
	};

	coordinateSystemBases.map((line : Line.Types.T_ColoredLine<Line.Types.T_Line3D>): void =>
	{
		DrawLineOnCanvas(line.coord, line.color);	
	});
};

function DrawMeshOnCanvas(
	buffer  : Uint8ClampedArray,
	context : CanvasRenderingContext2D,
	mesh    : Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[],
	camera  : Rasterizer.PolarCamera.Types.T_PolarCamera,
): void
{
	function DrawPolygonePointsOnCanvas(
		polygonePointsCoord : Coord.Types.T_Coord2D[],
		color               : Color.RGB.Types.T_Color,
	): void
	{
		polygonePointsCoord.map((polygonePointCoord:Coord.Types.T_Coord2D) =>
		{
			FillPixelBuffer(
				buffer,
				context,
				Rasterizer.Utils.CenterDisplayOrigin(polygonePointCoord, context.canvas.width, context.canvas.height),
				color,
			);
		});	
	};

	function DrawPolygoneOnCanvas(
		polygone : Polygone.Types.T_Polygone3D,
		color    : Color.RGB.Types.T_Color,
	) : void
	{
		const polygoneCoord       : Coord.Types.T_Coord2D[] = Rasterizer.Utils.PolygoneFromCameraSpace_ToDisplaySpace_Polygone(polygone, camera.polarCoord.radius);
		const polygonePointsCoord : Coord.Types.T_Coord2D[] = Polygone.Utils.GetPolygonePointsCoord(polygoneCoord);

		DrawPolygonePointsOnCanvas(polygonePointsCoord, color);
	};

	mesh.map((polygone : Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>): void =>
	{
		DrawPolygoneOnCanvas(polygone.coord, polygone.color);	
	});
};

export function ExtractCameraToAnchorVector_FromCameraToWorldMatrix(cameraToWorldMatrix : Matrix.Types.T_Matrix_4_4) : Vector.Types.T_Vec3D
{
	return ([cameraToWorldMatrix[0][0],cameraToWorldMatrix[0][1],cameraToWorldMatrix[0][2]]);
};

export function ExtractCameraToSideVector_FromCameraToWorldMatrix(cameraToWorldMatrix : Matrix.Types.T_Matrix_4_4) : Vector.Types.T_Vec3D
{
	return ([cameraToWorldMatrix[1][0],cameraToWorldMatrix[1][1],cameraToWorldMatrix[1][2]]);
};

export function ExtractCameraToTopVector_FromCameraToWorldMatrix(cameraToWorldMatrix : Matrix.Types.T_Matrix_4_4) : Vector.Types.T_Vec3D
{
	return ([cameraToWorldMatrix[2][0],cameraToWorldMatrix[2][1],cameraToWorldMatrix[2][2]]);
};

export function RedrawFrame(
	canvas                  : HTMLCanvasElement | undefined,
	camera                  : Types.T_CameraState,
	coordinateSystemBases  ?: Rasterizer.Types.T_CoordinateBases_3D,
	mesh                   ?: Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[],
	background             ?: Color.RGB.Types.T_Color,
) : void
{
	if (canvas != null)
	{
		const context : CanvasRenderingContext2D|null = canvas.getContext("2d");
		
		if (context)
		{
			const imagedata           : ImageData                 = context.createImageData(context.canvas.width, context.canvas.height);
			const cameraToWorldMatrix : Matrix.Types.T_Matrix_4_4 = Rasterizer.PolarCamera.Utils.GenerateCamera_ToWorldMatrix(camera);
			const worldToCameraMatrix : Matrix.Types.T_Matrix_4_4 = Matrix.Utils.InverseMatrix(cameraToWorldMatrix, 4);
			
			let coordinateSystemInCameraSpace : Rasterizer.Types.T_CoordinateBases_3D | undefined                           = undefined;
			let meshInCameraSpace             : Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[] | undefined = undefined;

			if (coordinateSystemBases) coordinateSystemInCameraSpace = Rasterizer.Utils.FromWorldSpace_ToCameraSpace_CoordSystemBases(worldToCameraMatrix, coordinateSystemBases);
			if (mesh)                  meshInCameraSpace             = Rasterizer.Utils.FromWorldSpace_ToCameraSpace_Mesh            (worldToCameraMatrix, mesh);      
			if (background)            FillCanvasBackground(imagedata.data, context, background);

			if (coordinateSystemInCameraSpace) DrawCoordSystemOnCanvas(imagedata.data, context, coordinateSystemInCameraSpace, camera);
			if (meshInCameraSpace)             DrawMeshOnCanvas       (imagedata.data, context, meshInCameraSpace            , camera);

			context.putImageData(imagedata, 0, 0);

			camera.cameraToWorldMatrix  = cameraToWorldMatrix;
			camera.worldToCameraMatrix  = worldToCameraMatrix;
			camera.cameraToAnchorVector = ExtractCameraToAnchorVector_FromCameraToWorldMatrix(worldToCameraMatrix);
			camera.cameraToSideVector   = ExtractCameraToSideVector_FromCameraToWorldMatrix  (worldToCameraMatrix);
			camera.cameraToTopVector    = ExtractCameraToTopVector_FromCameraToWorldMatrix   (worldToCameraMatrix);
		}
	}
};
