import * as Polygone   from "../../../Utils/Shapes/Polygone";
import * as Line       from "../../../Utils/Shapes/Line";
import * as Rasterizer from "../../../Utils/Rasterizer";
import * as Matrix     from "../../../Utils/Matrix";
import * as Coord      from "../../../Utils/Coord";
import * as Color      from "../../../Utils/Color";
import * as Vector     from "../../../Utils/Vector";

import * as Types from "./types";


function RemoveLinePartOutsideOfCanvas(
	line       : Line.Types.T_Line2D,
	canvasSize : Types.T_CanvasSize,
) : Line.Types.T_Line2D | null
{
	function IsPointOutOfCanvas(pointCoord : Coord.Types.T_Coord2D) : Types.E_CanvasAreas
	{
		function IsPointOutOfCanvas_Top     (pointCoord : Coord.Types.T_Coord2D) : boolean { return (pointCoord.y < 0                ); };
		function IsPointOutOfCanvas_Bottom  (pointCoord : Coord.Types.T_Coord2D) : boolean { return (pointCoord.y > canvasSize.height); };
		function IsPointOutOfCnavas_Left    (pointCoord : Coord.Types.T_Coord2D) : boolean { return (pointCoord.x < 0                ); };
		function IsPointOutOfCnavas_Right   (pointCoord : Coord.Types.T_Coord2D) : boolean { return (pointCoord.x > canvasSize.width ); };

		if (IsPointOutOfCnavas_Left(pointCoord))
		{
			if      (IsPointOutOfCanvas_Top   (pointCoord)) return (Types.E_CanvasAreas.OUT_LEFT_TOP);
			else if (IsPointOutOfCanvas_Bottom(pointCoord)) return (Types.E_CanvasAreas.OUT_LEFT_BOTTOM);
			else                                            return (Types.E_CanvasAreas.OUT_LEFT);
		}
		else if (IsPointOutOfCnavas_Right(pointCoord))
		{
			if      (IsPointOutOfCanvas_Top   (pointCoord)) return (Types.E_CanvasAreas.OUT_RIGHT_TOP);
			else if (IsPointOutOfCanvas_Bottom(pointCoord)) return (Types.E_CanvasAreas.OUT_RIGHT_BOTTOM);
			else                                            return (Types.E_CanvasAreas.OUT_RIGHT);
		}
		else if (IsPointOutOfCanvas_Top   (pointCoord)) return(Types.E_CanvasAreas.OUT_TOP);
		else if (IsPointOutOfCanvas_Bottom(pointCoord)) return(Types.E_CanvasAreas.OUT_BOTTOM);
		else                                            return(Types.E_CanvasAreas.IN);
	};

	function GetNewLineInCanvas_Vertical(
		pointInCanvas  : Coord.Types.T_Coord2D,
		pointOutCanvas : Coord.Types.T_Coord2D,
		limit          : number,
	) : Coord.Types.T_Coord2D
	{
		const vectorFactor : number = (limit - pointInCanvas.y) / (pointOutCanvas.y - pointInCanvas.y);

		return ({ x: pointInCanvas.x + (pointOutCanvas.x - pointInCanvas.x) * vectorFactor, y: limit });
	};

	function GetNewLineInCanvas_Horizontal(
		pointInCanvas  : Coord.Types.T_Coord2D,
		pointOutCanvas : Coord.Types.T_Coord2D,
		limit          : number,
	) : Coord.Types.T_Coord2D
	{
		const vectorFactor : number = (limit - pointInCanvas.x) / (pointOutCanvas.x - pointInCanvas.x);

		return ({ x: limit, y: pointInCanvas.y + (pointOutCanvas.y - pointInCanvas.y) * vectorFactor });
	};

	function GetNewLineInCanvas_Diagonal(
		pointInCanvas   : Coord.Types.T_Coord2D,
		pointOutCanvas  : Coord.Types.T_Coord2D,
		limitHorizontal : number,
		limitVertical   : number,
	) : Coord.Types.T_Coord2D
	{
		const vectorFactor_Horizontal : number = (limitHorizontal - pointInCanvas.x) / (pointOutCanvas.x - pointInCanvas.x);
		const vectorFactor_Vertical   : number = (limitVertical   - pointInCanvas.y) / (pointOutCanvas.y - pointInCanvas.y);

		if      (vectorFactor_Horizontal < vectorFactor_Vertical) return ({ x: limitHorizontal, y: pointInCanvas.y + (pointOutCanvas.y - pointInCanvas.y) * vectorFactor_Horizontal } );
		else if (vectorFactor_Horizontal > vectorFactor_Vertical) return ({ x: pointInCanvas.x + (pointOutCanvas.x - pointInCanvas.x) * vectorFactor_Vertical, y: limitVertical })
		else                                                      return ({ x: limitHorizontal, y: limitVertical });
	};

	console.log(canvasSize);

	const lineStartLocationRelativeToCanvas : Types.E_CanvasAreas = IsPointOutOfCanvas(line.start);
	const lineEndLocationRelativeToCanvas   : Types.E_CanvasAreas = IsPointOutOfCanvas(line.end);

	if      (lineStartLocationRelativeToCanvas !== Types.E_CanvasAreas.IN && lineEndLocationRelativeToCanvas !== Types.E_CanvasAreas.IN) return (null);
	else if (lineStartLocationRelativeToCanvas === Types.E_CanvasAreas.IN && lineEndLocationRelativeToCanvas === Types.E_CanvasAreas.IN) return (line);
	else 
	{
		if      (lineStartLocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT        ) return({ start: GetNewLineInCanvas_Horizontal(line.end, line.start, 0)                                  , end: line.end                                                                                 });
		else if (lineEndLocationRelativeToCanvas   === Types.E_CanvasAreas.OUT_LEFT        ) return({ start: line.start                                                                              , end: GetNewLineInCanvas_Horizontal(line.start, line.end, 0)                                   });
		else if (lineStartLocationRelativeToCanvas === Types.E_CanvasAreas.OUT_TOP         ) return({ start: GetNewLineInCanvas_Vertical  (line.end, line.start, 0)                                  , end: line.end                                                                                 });
		else if (lineEndLocationRelativeToCanvas   === Types.E_CanvasAreas.OUT_TOP         ) return({ start: line.start                                                                              , end: GetNewLineInCanvas_Vertical  (line.start, line.end, 0)                                   });
		else if (lineStartLocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT       ) return({ start: GetNewLineInCanvas_Horizontal(line.end, line.start, canvasSize.width)                   , end: line.end                                                                                 });
		else if (lineEndLocationRelativeToCanvas   === Types.E_CanvasAreas.OUT_RIGHT       ) return({ start: line.start                                                                              , end: GetNewLineInCanvas_Horizontal(line.end, line.start, canvasSize.width)                    });
		else if (lineStartLocationRelativeToCanvas === Types.E_CanvasAreas.OUT_BOTTOM      ) return({ start: GetNewLineInCanvas_Vertical  (line.end, line.start, canvasSize.height)                  , end: line.end                                                                                 });
		else if (lineEndLocationRelativeToCanvas   === Types.E_CanvasAreas.OUT_BOTTOM      ) return({ start: line.start                                                                              , end: GetNewLineInCanvas_Vertical  (line.end, line.start, canvasSize.height)                   });
		else if (lineStartLocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT_TOP    ) return({ start: GetNewLineInCanvas_Diagonal  (line.end, line.start, 0, 0)                               , end: line.end                                                                                 });
		else if (lineEndLocationRelativeToCanvas   === Types.E_CanvasAreas.OUT_LEFT_TOP    ) return({ start: line.start                                                                              , end: GetNewLineInCanvas_Diagonal  (line.start, line.end, 0, 0)                                });
		else if (lineStartLocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT_TOP   ) return({ start: GetNewLineInCanvas_Diagonal  (line.end, line.start, canvasSize.width, 0)                , end: line.end                                                                                 });
		else if (lineEndLocationRelativeToCanvas   === Types.E_CanvasAreas.OUT_RIGHT_TOP   ) return({ start: line.start                                                                              , end: GetNewLineInCanvas_Diagonal  (line.start, line.end, canvasSize.width, 0)                 });
		else if (lineStartLocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT_BOTTOM) return({ start: GetNewLineInCanvas_Diagonal  (line.end, line.start, canvasSize.width, canvasSize.height), end: line.end                                                                                 });
		else if (lineEndLocationRelativeToCanvas   === Types.E_CanvasAreas.OUT_RIGHT_BOTTOM) return({ start: line.start                                                                              , end: GetNewLineInCanvas_Diagonal  (line.start, line.end, canvasSize.width, canvasSize.height) });
		else if (lineStartLocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT_BOTTOM ) return({ start: GetNewLineInCanvas_Diagonal  (line.end, line.start, 0, canvasSize.height)               , end: line.end                                                                                 });
		else if (lineEndLocationRelativeToCanvas   === Types.E_CanvasAreas.OUT_LEFT_BOTTOM ) return({ start: line.start                                                                              , end: GetNewLineInCanvas_Diagonal  (line.start, line.end, 0, canvasSize.height)                });
		else                                                                                 return(null);
	}
};

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
		context : CanvasRenderingContext2D,
	): void
	{
		const canvasSize : Types.T_CanvasSize = { width: context.canvas.clientWidth, height: context.canvas.clientHeight };

		const lineStartCoord : Coord.Types.T_Coord2D      = Rasterizer.Utils.FromCameraSpace_ToDisplaySpace_Coord(line.start, camera.polarCoord.radius);
		const lineEndCoord 	 : Coord.Types.T_Coord2D      = Rasterizer.Utils.FromCameraSpace_ToDisplaySpace_Coord(line.end  , camera.polarCoord.radius);
		const lineInCanvas   : Line.Types.T_Line2D | null = RemoveLinePartOutsideOfCanvas({ start: lineStartCoord, end: lineEndCoord }, canvasSize);

		if (lineInCanvas)
			DrawLinePointsOnCanvas(Line.Utils.GetLinePointsCoord(lineInCanvas), color);
	};

	coordinateSystemBases.map((line : Line.Types.T_ColoredLine<Line.Types.T_Line3D>): void =>
	{
		DrawLineOnCanvas(line.coord, line.color, context);	
	});
};

function DrawMeshOnCanvas(
	buffer  : Uint8ClampedArray,
	context : CanvasRenderingContext2D,
	mesh    : Types.T_ModelMesh,
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
	mesh                   ?: Types.T_ModelMesh,
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
			
			let coordinateSystemInCameraSpace : Rasterizer.Types.T_CoordinateBases_3D | undefined = undefined;
			let meshInCameraSpace             : Types.T_ModelMesh                     | undefined = undefined;

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
