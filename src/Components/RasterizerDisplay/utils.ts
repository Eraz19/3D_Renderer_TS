import * as Types      from "./types";
import * as Polygone   from "../../Utils/Shapes/Polygone";
import * as Line       from "../../Utils/Shapes/Line";
import * as Rasterizer from "../../Utils/Rasterizer";
import * as Matrix     from "../../Utils/Matrix";
import * as Coord      from "../../Utils/Coord";
import * as Color      from "../../Utils/Color";


function FillPixelBuffer(
	buffer  : Uint8ClampedArray,
	context : CanvasRenderingContext2D,
	coord   : Coord.Types.T_Coord2D,
	color   : Color.RGB.Types.T_Color,
): void
{
	// We need to multiply by 4 the all surface because each pixel is encode on a RGBA palette
	const bufferIndex : number = (coord.x + coord.y * context.canvas.width) * 4;

	if (bufferIndex >= 0 && bufferIndex < buffer.length - 4)
	{
		buffer[bufferIndex + 0] = color.red;
		buffer[bufferIndex + 1] = color.green;
		buffer[bufferIndex + 2] = color.blue;
		buffer[bufferIndex + 3] = 255;
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
		const lineStartCoord  : Coord.Types.T_Coord2D   = Rasterizer.Utils.FromCameraSpace_ToDisplaySpace(line.start, camera.polarCoord.radius);
		const lineEndCoord 	  : Coord.Types.T_Coord2D   = Rasterizer.Utils.FromCameraSpace_ToDisplaySpace(line.end  , camera.polarCoord.radius);
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
	):void
	{
		const polygoneCoord       : Coord.Types.T_Coord2D[] = polygone.map((coord : Coord.Types.T_Coord3D): Coord.Types.T_Coord2D => { return (Rasterizer.Utils.FromCameraSpace_ToDisplaySpace(coord, camera.polarCoord.radius)); });
		const polygonePointsCoord : Coord.Types.T_Coord2D[] = Polygone.Utils.GetPolygonePointsCoord(polygoneCoord);

		DrawPolygonePointsOnCanvas(polygonePointsCoord, color);
	};

	mesh.map((polygone : Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>): void =>
	{
		DrawPolygoneOnCanvas(polygone.coord, polygone.color);	
	});
};

export function RenderFrame(
	canvas                : HTMLCanvasElement|null,
	coordinateSystemBases : Rasterizer.Types.T_CoordinateBases_3D,
	mesh                  : Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[],
	camera                : Types.T_Camera,
): void
{
	if (canvas != null)
	{
		const context : CanvasRenderingContext2D|null = canvas.getContext("2d");
		
		if (context)
		{
			const imagedata                     : ImageData                                                       = context.createImageData(context.canvas.width, context.canvas.height);
			const cameraToWorldMatrix           : Matrix.Types.T_Matrix_4_4                                       = Rasterizer.PolarCamera.Utils.GenerateCamera_ToWorldMatrix(camera);
			const worldToCameraMatrix           : Matrix.Types.T_Matrix_4_4                                       = Matrix.Utils.InverseMatrix(cameraToWorldMatrix, 4);
			const coordinateSystemInCameraSpace : Rasterizer.Types.T_CoordinateBases_3D                           = Rasterizer.Utils.FromWorldSpace_ToCameraSpace_CoordSystemBases(worldToCameraMatrix, coordinateSystemBases);
			const meshInCameraSpace             : Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[] = Rasterizer.Utils.FromWorldSpace_ToCameraSpace_Mesh            (worldToCameraMatrix, mesh                 );

			DrawCoordSystemOnCanvas(imagedata.data, context, coordinateSystemInCameraSpace, camera);
			DrawMeshOnCanvas       (imagedata.data, context, meshInCameraSpace            , camera);
			context.putImageData   (imagedata, 0, 0);

			camera.cameraToWorldMatrix = cameraToWorldMatrix;
		}
	}
};
