import * as Polygone   from "../../../Utils/Shapes/Polygone";
import * as Line       from "../../../Utils/Shapes/Line";
import * as Rasterizer from "../../../Utils/Rasterizer";
import * as Matrix     from "../../../Utils/Matrix";
import * as Coord      from "../../../Utils/Coord";
import * as Color      from "../../../Utils/Color";
import * as Vector     from "../../../Utils/Vector";

import * as Types from "./types";

let debug : string = "";



function CameraDebug(camera : Types.T_CameraState) : string
{
	return (
		`
			Phi    = ${camera.polarCoord.phi}
			Theta  = ${camera.polarCoord.theta}
			Radius = ${camera.polarCoord.radius}

			Anchor = ${CoordPrinting_3(camera.anchor)}
		`
	);
};

function CoordPrinting_3(coord :  Coord.Types.T_Coord3D) : string
{
	return (`[${coord.x},${coord.y},${coord.z}]`);
};

function MatrixPrinting_4(matrix : Matrix.Types.T_Matrix_4_4) : string
{
	return (
		`	
			[${matrix[0][0]},${matrix[0][1]},${matrix[0][2]},${matrix[0][3]}]
			[${matrix[1][0]},${matrix[1][1]},${matrix[1][2]},${matrix[1][3]}]
			[${matrix[2][0]},${matrix[2][1]},${matrix[2][2]},${matrix[2][3]}]
			[${matrix[3][0]},${matrix[3][1]},${matrix[3][2]},${matrix[3][3]}]
		`
	);
};

function MatrixPrinting_3(matrix : Matrix.Types.T_Matrix_3_3) : string
{
	return (
		`
			[${matrix[0][0]},${matrix[0][1]},${matrix[0][2]}]
			[${matrix[1][0]},${matrix[1][1]},${matrix[1][2]}]
			[${matrix[2][0]},${matrix[2][1]},${matrix[2][2]}]
		`
	);
};

function ColorPrinting(color : Color.RGB.Types.T_Color) : string
{
	if      (color.red   === 255) return ("RED");
	else if (color.green === 255) return ("GREEN");
	else if (color.blue  === 255) return ("BLUE");
	else                          return ("BLACK");
};

function LinesPrintingInCamera(lines : Line.Types.T_ColoredLine<Line.Types.T_Line3D>[], value : string) : string
{
	return (
		`
Vertex0 ${value}  : ${CoordPrinting_3(lines[0].coord.start)}

Vertex1 ${value}  : ${CoordPrinting_3(lines[0].coord.end)}

Vertex2 ${value}  : ${CoordPrinting_3(lines[1].coord.end)}

Vertex3 ${value}  : ${CoordPrinting_3(lines[2].coord.end)}
		`
	);
};

function VectorPrinting3(vector : Vector.Types.T_Vec3D) : string
{
	return (`[${vector[0]},${vector[1]},${vector[2]}]`);
};

function DebugPrinting() : void
{
	console.log(debug);
};

/***************************************************************/

function FromCoordWorld_ToCoordCamera(
	cameraMatrix : Matrix.Types.T_Matrix_4_4,
	coord        : Coord.Types.T_Coord3D,
) : Coord.Types.T_Coord3D
{
	return ({ ...Matrix.Utils.Transformation(cameraMatrix, { ...coord, w: 1 }) });
};

export function FromCameraSpace_ToDisplaySpace_Coord(
	coord        : Coord.Types.T_Coord3D,
	cameraRadius : number,
): Coord.Types.T_Coord3D
{
	return (Matrix.Utils.Transformation([[0,cameraRadius,0],[0,0,cameraRadius],[cameraRadius,0,0]], coord));
};

export function CenterDisplayOrigin(
	coord         : Coord.Types.T_Coord3D,
	displayWidth  : number,
	displayHeight : number,
):Coord.Types.T_Coord3D
{
	console.log({...coord});

	return ({ x: Math.floor(coord.x + displayWidth * .5), y: Math.floor(-coord.y + displayHeight * .5), z: coord.z });
};

export function FromWorldSpace_ToCameraSpace(
	cameraMatrix : Matrix.Types.T_Matrix_4_4,
	mesh         : Line.Types.T_ColoredLine<Line.Types.T_Line3D>[],
): Line.Types.T_ColoredLine<Line.Types.T_Line3D>[]
{
	return (
		mesh.map((line : Line.Types.T_ColoredLine<Line.Types.T_Line3D>): Line.Types.T_ColoredLine<Line.Types.T_Line3D> =>
		{
			return (
				{
					color: line.color,
					coord:
					{
						start: FromCoordWorld_ToCoordCamera(cameraMatrix, line.coord.start),
						end  : FromCoordWorld_ToCoordCamera(cameraMatrix, line.coord.end),
					}
				}
			);
		})
	);
};

/***************************************************************/

function UpdateCamera(
	camera              : Types.T_CameraState,
	cameraToWorldMatrix : Matrix.Types.T_Matrix_4_4,
	worldToCameraMatrix : Matrix.Types.T_Matrix_4_4,
) : void
{
	function ExtractCameraToAnchorVector_FromCameraToWorldMatrix(cameraToWorldMatrix : Matrix.Types.T_Matrix_4_4) : Vector.Types.T_Vec3D
	{
		return ([cameraToWorldMatrix[0][0],cameraToWorldMatrix[0][1],cameraToWorldMatrix[0][2]]);
	};
	
	function ExtractCameraToSideVector_FromCameraToWorldMatrix(cameraToWorldMatrix : Matrix.Types.T_Matrix_4_4) : Vector.Types.T_Vec3D
	{
		return ([cameraToWorldMatrix[1][0],cameraToWorldMatrix[1][1],cameraToWorldMatrix[1][2]]);
	};
	
	function ExtractCameraToTopVector_FromCameraToWorldMatrix(cameraToWorldMatrix : Matrix.Types.T_Matrix_4_4) : Vector.Types.T_Vec3D
	{
		return ([cameraToWorldMatrix[2][0],cameraToWorldMatrix[2][1],cameraToWorldMatrix[2][2]]);
	};

	camera.cameraToWorldMatrix  = cameraToWorldMatrix;
	camera.worldToCameraMatrix  = worldToCameraMatrix;
	camera.cameraToAnchorVector = ExtractCameraToAnchorVector_FromCameraToWorldMatrix(worldToCameraMatrix);
	camera.cameraToSideVector   = ExtractCameraToSideVector_FromCameraToWorldMatrix  (worldToCameraMatrix);
	camera.cameraToTopVector    = ExtractCameraToTopVector_FromCameraToWorldMatrix   (worldToCameraMatrix);
};

function RemoveLinePartOutsideOfCanvas(
	line       : Line.Types.T_Line3D,
	canvasSize : Types.T_CanvasSize,
) : Line.Types.T_Line3D | null
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
		pointInCanvas  : Coord.Types.T_Coord3D,
		pointOutCanvas : Coord.Types.T_Coord3D,
		limit          : number,
	) : Coord.Types.T_Coord3D
	{
		const vectorFactor : number = (limit - pointInCanvas.y) / (pointOutCanvas.y - pointInCanvas.y);

		return ({ x: Math.floor(pointInCanvas.x + ((pointOutCanvas.x - pointInCanvas.x) * vectorFactor)), y: limit, z: pointOutCanvas.z });
	};

	function GetNewLineInCanvas_Horizontal(
		pointInCanvas  : Coord.Types.T_Coord3D,
		pointOutCanvas : Coord.Types.T_Coord3D,
		limit          : number,
	) : Coord.Types.T_Coord3D
	{
		const vectorFactor : number = (limit - pointInCanvas.x) / (pointOutCanvas.x - pointInCanvas.x);

		return ({ x: limit, y: Math.floor(pointInCanvas.y + ((pointOutCanvas.y - pointInCanvas.y) * vectorFactor)), z: pointOutCanvas.z });
	};

	function GetNewLineInCanvas_Diagonal(
		pointInCanvas   : Coord.Types.T_Coord3D,
		pointOutCanvas  : Coord.Types.T_Coord3D,
		limitHorizontal : number,
		limitVertical   : number,
	) : Coord.Types.T_Coord3D
	{
		const vectorFactor_Horizontal : number = (limitHorizontal - pointInCanvas.x) / (pointOutCanvas.x - pointInCanvas.x);
		const vectorFactor_Vertical   : number = (limitVertical   - pointInCanvas.y) / (pointOutCanvas.y - pointInCanvas.y);

		if      (vectorFactor_Horizontal < vectorFactor_Vertical) return ({ x: limitHorizontal, y: Math.floor(pointInCanvas.y + ((pointOutCanvas.y - pointInCanvas.y) * vectorFactor_Horizontal)), z: pointOutCanvas.z });
		else if (vectorFactor_Horizontal > vectorFactor_Vertical) return ({ x: Math.floor(pointInCanvas.x + ((pointOutCanvas.x - pointInCanvas.x) * vectorFactor_Vertical)), y: limitVertical    , z: pointOutCanvas.z });
		else                                                      return ({ x: limitHorizontal, y: limitVertical, z: pointOutCanvas.z });
	};

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

function RenderCanvasBackground(
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

function GetLinesToRender(
	context               : CanvasRenderingContext2D,
	coordinateSystemBases : Line.Types.T_ColoredLine<Line.Types.T_Line3D>[],
	camera                : Rasterizer.PolarCamera.Types.T_PolarCamera,
): (Line.Types.T_ColoredLine<Line.Types.T_Line3D> | null)[]
{
	function LineFromCameraSpace_ToDisplaySpace(line : Line.Types.T_ColoredLine<Line.Types.T_Line3D>, index : number): Line.Types.T_ColoredLine<Line.Types.T_Line3D> | null
	{
		if (index === 0)
		{
			debug += `Vertex0 ${"FromCameraSpace_ToDisplaySpace"}: ${CoordPrinting_3(FromCameraSpace_ToDisplaySpace_Coord(line.coord.start, camera.polarCoord.radius))}\n`;
			debug += `Vertex0 ${"CenterDisplayOrigin"}           : ${CoordPrinting_3(CenterDisplayOrigin(FromCameraSpace_ToDisplaySpace_Coord(line.coord.start, camera.polarCoord.radius), context.canvas.width, context.canvas.height))}\n`;
		}

		debug += `Vertex${index + 1} ${"FromCameraSpace_ToDisplaySpace"}: ${CoordPrinting_3(FromCameraSpace_ToDisplaySpace_Coord(line.coord.end  , camera.polarCoord.radius))}\n`
		debug += `Vertex${index + 1} ${"CenterDisplayOrigin"}           : ${CoordPrinting_3(CenterDisplayOrigin(FromCameraSpace_ToDisplaySpace_Coord(line.coord.end  , camera.polarCoord.radius), context.canvas.width, context.canvas.height))}\n`


		const lineInDisplay : Line.Types.T_Line3D | null = RemoveLinePartOutsideOfCanvas(
			{
				start: CenterDisplayOrigin(FromCameraSpace_ToDisplaySpace_Coord(line.coord.start, camera.polarCoord.radius), context.canvas.width, context.canvas.height),
				end  : CenterDisplayOrigin(FromCameraSpace_ToDisplaySpace_Coord(line.coord.end  , camera.polarCoord.radius), context.canvas.width, context.canvas.height),
			},
			{
				width : context.canvas.clientWidth,
				height: context.canvas.clientHeight,
			}
		);
		
		if (lineInDisplay) return ({ color: line.color, coord: lineInDisplay });
		else               return (null);
	};

	return (coordinateSystemBases.map(LineFromCameraSpace_ToDisplaySpace));
};

function RenderAllFrameLines(
	buffer  : Uint8ClampedArray,
	context : CanvasRenderingContext2D,
	lines   : (Line.Types.T_ColoredLine<Line.Types.T_Line3D> | null)[],
) : void
{
	function RemoveAllUnrenderedLines(line : Line.Types.T_ColoredLine<Line.Types.T_Line3D> | null) : boolean
	{
		return (line != null);
	};

	function SortLineToGetLineRestpectDeepness(
		line1 : Line.Types.T_ColoredLine<Line.Types.T_Line3D> | null,
		line2 : Line.Types.T_ColoredLine<Line.Types.T_Line3D> | null,
	) : number
	{
		if (line1 && line2)
		{
			const averageZDepthLine1 : number = line1.coord.start.z + line1.coord.end.z;
			const averageZDepthLine2 : number = line2.coord.start.z + line2.coord.end.z;

			if      (averageZDepthLine1 > averageZDepthLine2) return (-1);
			else if (averageZDepthLine1 < averageZDepthLine2) return (1);
			else                                              return (0);
		}
		else
			return (0);
	};

	function RenderLines(line : Line.Types.T_ColoredLine<Line.Types.T_Line3D> | null) : void
	{
		function DrawLinePointsOnCanvas(
			linePointsCoord : Coord.Types.T_Coord2D[],
			color           : Color.RGB.Types.T_Color,
		): void
		{
			linePointsCoord.map((linePointCoord:Coord.Types.T_Coord2D): void => { FillPixelBuffer(buffer, context, linePointCoord, color); });	
		};

		if (line)
			DrawLinePointsOnCanvas(Line.Utils.GetLinePointsCoord(line.coord), line.color);
	};

	lines
	.filter(RemoveAllUnrenderedLines)
	.sort  (SortLineToGetLineRestpectDeepness)
	.map   (RenderLines);
};

export function RenderFrame(
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
			debug += "";

			debug += "Camera: \n";
			debug += CameraDebug(camera);
			debug += "\n";

			const imagedata : ImageData = context.createImageData(context.canvas.width, context.canvas.height);

			const cameraToWorldMatrix : Matrix.Types.T_Matrix_4_4 = Rasterizer.PolarCamera.Utils.GenerateCamera_ToWorldMatrix(camera);

			debug += "cameraToWorldMatrix: \n"
			debug += MatrixPrinting_4(cameraToWorldMatrix);
			debug += "\n";

			const worldToCameraMatrix : Matrix.Types.T_Matrix_4_4 = Matrix.Utils.InverseMatrix(cameraToWorldMatrix, 4);

			debug += "worldToCameraMatrix: \n"
			debug += MatrixPrinting_4(worldToCameraMatrix);
			debug += "\n\n";

			const coordinateSystemInCameraSpace : Line.Types.T_ColoredLine<Line.Types.T_Line3D>[] = FromWorldSpace_ToCameraSpace(worldToCameraMatrix, coordinateSystemBases ?? []);

			debug += LinesPrintingInCamera(coordinateSystemInCameraSpace, "FromWorldSpace_ToCameraSpace");

			const meshLines         : Line.Types.T_ColoredLine<Line.Types.T_Line3D>[] = Polygone.Utils.FromColoredPolygones_ToColoredLines(mesh ?? []);
			const meshInCameraSpace : Line.Types.T_ColoredLine<Line.Types.T_Line3D>[] = Rasterizer.Utils.FromWorldSpace_ToCameraSpace(worldToCameraMatrix, meshLines);

			const coordinateSystemLinesToRender : (Line.Types.T_ColoredLine<Line.Types.T_Line3D> | null)[] = GetLinesToRender(context, coordinateSystemInCameraSpace, camera);
			const meshLinesToRender             : (Line.Types.T_ColoredLine<Line.Types.T_Line3D> | null)[] = GetLinesToRender(context, meshInCameraSpace            , camera);
			
			console.log(coordinateSystemLinesToRender)

			if (background)
				RenderCanvasBackground (imagedata.data, context, background);

			RenderAllFrameLines(imagedata.data, context, [...coordinateSystemLinesToRender, ...meshLinesToRender]);

			context.putImageData(imagedata, 0, 0);

			DebugPrinting();
			UpdateCamera(camera, cameraToWorldMatrix, worldToCameraMatrix);
		}
	}
};
