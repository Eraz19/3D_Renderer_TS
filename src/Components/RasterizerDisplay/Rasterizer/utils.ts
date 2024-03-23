import * as Rasterizer from "../../../Utils/Rasterizer";
import * as Matrix     from "../../../Utils/Matrix";
import * as Coord      from "../../../Utils/Coord";
import * as Color      from "../../../Utils/Color";
import * as Vector     from "../../../Utils/Vector";

import * as Types from "./types";


/********************* Prepare Vertices *********************/

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

function CenterDisplayOrigin(
	vertex        : Types.T_ModelMesh_Vertex,
	displayWidth  : number,
	displayHeight : number,
) : void
{
	vertex[0] = Math.floor(vertex[0]  + displayWidth  * .5);
	vertex[1] = Math.floor(-vertex[1] + displayHeight * .5);
};

function FromCameraSpace_ToDisplaySpace(
	vertex       : Types.T_ModelMesh_Vertex,
	cameraRadius : number,
) : void
{
	Transformation_3_3(vertex, [[0,cameraRadius,0],[0,0,cameraRadius],[cameraRadius,0,0]]);
};

function FromWorldSpace_ToCameraSpace(
	vertex                   : Types.T_ModelMesh_Vertex,
	scalingAndRotationMatrix : Matrix.Types.T_Matrix_3_3,
	translationVector        : Vector.Types.T_Vec3D,
) : void
{
	Transformation_3_3(vertex, scalingAndRotationMatrix);
	Add_3             (vertex, translationVector       );
};

function FromWorldSpace_ToDisplaySpace(
	vertices                 : Types.T_ModelMesh_Vertex[],
	scalingAndRotationMatrix : Matrix.Types.T_Matrix_3_3,
	translationVector        : Vector.Types.T_Vec3D,
	cameraRadius             : number,
	displayWidth             : number,
	displayHeight            : number,
): Vector.Types.T_Vec3D[]
{
	return (
		vertices.map((vertex : Types.T_ModelMesh_Vertex): Types.T_ModelMesh_Vertex =>
		{
			let result : Types.T_ModelMesh_Vertex = [...vertex];

			FromWorldSpace_ToCameraSpace  (result, scalingAndRotationMatrix, translationVector);
			FromCameraSpace_ToDisplaySpace(result, cameraRadius                               );
			CenterDisplayOrigin           (result, displayWidth            , displayHeight    );

			return (result);
		})
	);
};

/********************* Prepare Edges *********************/

function FromEdgesIndex_ToEdgesVertices(
	edges    : Types.T_ModelMesh_Edges<number>,
	vertices : Types.T_ModelMesh_Vertices,
) : Types.T_ModelMesh_Edges<Types.T_ModelMesh_Vertex>
{
	return (
		edges.map((edge : Types.T_ModelMesh_Edge<number>) : Types.T_ModelMesh_Edge<Types.T_ModelMesh_Vertex> =>
		{
			return ({...edge, edge: [vertices[edge.edge[0]],vertices[edge.edge[1]]] });
		})
	);
};

function RemoveEdgesOutOfCanvas(
	canvasWidth  : number,
	canvasHeight : number,
) : (edge : Types.T_ModelMesh_Edge<Types.T_ModelMesh_Vertex>) => boolean
{
	return (
		(edge : Types.T_ModelMesh_Edge<Types.T_ModelMesh_Vertex>) : boolean =>
		{
			return (RemoveEdgesPartOutsideOfCanvas(edge.edge[0], edge.edge[1], canvasWidth, canvasHeight));
		}
	);
};

function RemoveEdgesPartOutsideOfCanvas(
	vertex1      : Types.T_ModelMesh_Vertex,
	vertex2      : Types.T_ModelMesh_Vertex,
	canvasWidth  : number,
	canvasHeight : number,
) : boolean
{
	function IsVertexOutOfCanvas(vertex : Types.T_ModelMesh_Vertex) : Types.E_CanvasAreas
	{
		const vertexX : number = vertex[0];
		const vertexY : number = vertex[1];

		function IsPointOutOfCanvas_Top     (y : number) : boolean { return (y < 0           ); };
		function IsPointOutOfCanvas_Bottom  (y : number) : boolean { return (y > canvasHeight); };
		function IsPointOutOfCnavas_Left    (x : number) : boolean { return (x < 0           ); };
		function IsPointOutOfCnavas_Right   (x : number) : boolean { return (x > canvasWidth ); };

		if (IsPointOutOfCnavas_Left(vertexX))
		{
			if      (IsPointOutOfCanvas_Top   (vertexY)) return (Types.E_CanvasAreas.OUT_LEFT_TOP);
			else if (IsPointOutOfCanvas_Bottom(vertexY)) return (Types.E_CanvasAreas.OUT_LEFT_BOTTOM);
			else                                         return (Types.E_CanvasAreas.OUT_LEFT);
		}
		else if (IsPointOutOfCnavas_Right(vertexX))
		{
			if      (IsPointOutOfCanvas_Top   (vertexY)) return (Types.E_CanvasAreas.OUT_RIGHT_TOP);
			else if (IsPointOutOfCanvas_Bottom(vertexY)) return (Types.E_CanvasAreas.OUT_RIGHT_BOTTOM);
			else                                         return (Types.E_CanvasAreas.OUT_RIGHT);
		}
		else if (IsPointOutOfCanvas_Top   (vertexY)) return(Types.E_CanvasAreas.OUT_TOP);
		else if (IsPointOutOfCanvas_Bottom(vertexY)) return(Types.E_CanvasAreas.OUT_BOTTOM);
		else                                         return(Types.E_CanvasAreas.IN);
	};

	function GetNewLineInCanvas_Vertical(
		vertexOutCanvas : Types.T_ModelMesh_Vertex,
		vertexXInCanvas : number,
		vertexYInCanvas : number,
		limit           : number,
	) : void
	{
		const vectorFactor : number = (limit - vertexYInCanvas) / (vertexOutCanvas[1] - vertexYInCanvas);

		vertexOutCanvas[0] = Math.floor(vertexXInCanvas + ((vertexOutCanvas[0] - vertexXInCanvas) * vectorFactor));
		vertexOutCanvas[1] = limit;
	};

	function GetNewLineInCanvas_Horizontal(
		vertexOutCanvas : Types.T_ModelMesh_Vertex,
		vertexXInCanvas : number,
		vertexYInCanvas : number,
		limit           : number,
	) : void
	{
		const vectorFactor : number = (limit - vertexXInCanvas) / (vertexOutCanvas[0] - vertexXInCanvas);

		vertexOutCanvas[0] = limit;
		vertexOutCanvas[1] = Math.floor(vertexYInCanvas + ((vertexOutCanvas[1] - vertexYInCanvas) * vectorFactor)),
	};

	function GetNewLineInCanvas_Diagonal(
		vertexOutCanvas : Types.T_ModelMesh_Vertex,
		vertexXInCanvas : number,
		vertexYInCanvas : number,
		limitHorizontal : number,
		limitVertical   : number,
	) : void
	{
		const vertexXOutCanvas : number = vertexOutCanvas[0];
		const vertexYOutCanvas : number = vertexOutCanvas[1];

		const vectorFactor_Horizontal : number = (limitHorizontal - vertexXInCanvas) / (vertexXOutCanvas - vertexXInCanvas);
		const vectorFactor_Vertical   : number = (limitVertical   - vertexYInCanvas) / (vertexYOutCanvas - vertexYInCanvas);

		vertexOutCanvas[0] = (vectorFactor_Horizontal > vectorFactor_Vertical) ? Math.floor(vertexXInCanvas + ((vertexXOutCanvas - vertexXInCanvas) * vectorFactor_Vertical))   : limitHorizontal;
		vertexOutCanvas[1] = (vectorFactor_Horizontal < vectorFactor_Vertical) ? Math.floor(vertexYInCanvas + ((vertexYOutCanvas - vertexYInCanvas) * vectorFactor_Horizontal)) : limitVertical;
	};

	const vertex1LocationRelativeToCanvas : Types.E_CanvasAreas = IsVertexOutOfCanvas(vertex1);
	const vertex2LocationRelativeToCanvas : Types.E_CanvasAreas = IsVertexOutOfCanvas(vertex2);

	if      (vertex1LocationRelativeToCanvas !== Types.E_CanvasAreas.IN && vertex2LocationRelativeToCanvas !== Types.E_CanvasAreas.IN) return (false);
	else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.IN && vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.IN) return (true);
	else 
	{
		if      (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT        ) GetNewLineInCanvas_Horizontal(vertex1, vertex2[0], vertex2[1], 0                         );
		else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_TOP         ) GetNewLineInCanvas_Vertical  (vertex1, vertex2[0], vertex2[1], 0                         );
		else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT       ) GetNewLineInCanvas_Horizontal(vertex1, vertex2[0], vertex2[1], canvasWidth               );
		else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_BOTTOM      ) GetNewLineInCanvas_Vertical  (vertex1, vertex2[0], vertex2[1], canvasHeight              );
		else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT_TOP    ) GetNewLineInCanvas_Diagonal  (vertex1, vertex2[0], vertex2[1], 0           , 0           );
		else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT_TOP   ) GetNewLineInCanvas_Diagonal  (vertex1, vertex2[0], vertex2[1], canvasWidth , 0           );
		else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT_BOTTOM) GetNewLineInCanvas_Diagonal  (vertex1, vertex2[0], vertex2[1], canvasWidth , canvasHeight);
		else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT_BOTTOM ) GetNewLineInCanvas_Diagonal  (vertex1, vertex2[0], vertex2[1], 0           , canvasHeight);
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT        ) GetNewLineInCanvas_Horizontal(vertex2, vertex1[0], vertex1[1], 0                         );
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_TOP         ) GetNewLineInCanvas_Vertical  (vertex2, vertex1[0], vertex1[1], 0                         );
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT       ) GetNewLineInCanvas_Horizontal(vertex2, vertex1[0], vertex1[1], canvasWidth               );
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_BOTTOM      ) GetNewLineInCanvas_Vertical  (vertex2, vertex1[0], vertex1[1], canvasHeight              );
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT_TOP    ) GetNewLineInCanvas_Diagonal  (vertex2, vertex1[0], vertex1[1], 0           , 0           );
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT_TOP   ) GetNewLineInCanvas_Diagonal  (vertex2, vertex1[0], vertex1[1], canvasWidth , 0           );
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT_BOTTOM) GetNewLineInCanvas_Diagonal  (vertex2, vertex1[0], vertex1[1], canvasWidth , canvasHeight);
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT_BOTTOM ) GetNewLineInCanvas_Diagonal  (vertex2, vertex1[0], vertex1[1], 0           , canvasHeight);

		return (true);
	}
};

function SortLineToGetLineRestpectDeepness(
	edge1 : Types.T_ModelMesh_Edge<Types.T_ModelMesh_Vertex>,
	edge2 : Types.T_ModelMesh_Edge<Types.T_ModelMesh_Vertex>,
) : number
{
	const averageZDepthLine1 : number = (edge1.edge[0][2] + edge1.edge[1][2]) * 0.5;
	const averageZDepthLine2 : number = (edge2.edge[0][2] + edge2.edge[1][2]) * 0.5;

	if      (averageZDepthLine1 > averageZDepthLine2) return (-1);
	else if (averageZDepthLine1 < averageZDepthLine2) return (1);
	else                                              return (0);
};

/********************* Fill pixel buffer *********************/

function FillPixelBuffer(
	buffer     : Uint8ClampedArray,
	width      : number,
	x          : number,
	y          : number,
	colorRed   : number,
	colorGreen : number,
	colorBlue  : number,
): void
{
	// We need to multiply by 4 the all surface because each pixel is encode on a RGBA palette
	const bufferIndex : number = (x + y * width) << 2;

	buffer[bufferIndex    ] = colorRed;
	buffer[bufferIndex + 1] = colorGreen;
	buffer[bufferIndex + 2] = colorBlue;
	buffer[bufferIndex + 3] = 255;
};

function RenderCanvasBackground(
	buffer  : Uint8ClampedArray,
	context : CanvasRenderingContext2D,
	color   : Color.RGB.Types.T_Color,
) : void
{
	const canvasWidth  : number = context.canvas.width;
	const canvasHeight : number = context.canvas.height;
	const colorRed     : number = color.red;
	const colorGreen   : number = color.green;
	const colorBlue    : number = color.blue;

	for (let i : number = 0; i <= canvasHeight; ++i)
	{
		for (let j : number = 0; j <= canvasWidth; ++j)
			FillPixelBuffer(buffer, canvasWidth, j, i, colorRed, colorGreen, colorBlue);
	}
};

/********************* Other *********************/

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



export function RenderFrame(
	canvas                  : HTMLCanvasElement | undefined,
	camera                  : Types.T_CameraState,
	coordinateSystemBases  ?: Types.T_CoordinateBases3D,
	mesh                   ?: Types.T_ModelMesh<number>,
	background             ?: Color.RGB.Types.T_Color,
) : void
{
	function ExtractRotateAndScaleMatrix_FromWorldToCameraMatrix(worldToCameraMatrix : Matrix.Types.T_Matrix_4_4) : Matrix.Types.T_Matrix_3_3
	{
		return(
			[
				[worldToCameraMatrix[0][0],worldToCameraMatrix[0][1],worldToCameraMatrix[0][2]],
				[worldToCameraMatrix[1][0],worldToCameraMatrix[1][1],worldToCameraMatrix[1][2]],
				[worldToCameraMatrix[2][0],worldToCameraMatrix[2][1],worldToCameraMatrix[2][2]],
			]
		);
	};

	function ExtractTranslateVector_FromWorldToCameraMatrix(worldToCameraMatrix : Matrix.Types.T_Matrix_4_4) : Vector.Types.T_Vec3D
	{
		return ([worldToCameraMatrix[0][3],worldToCameraMatrix[1][3],worldToCameraMatrix[2][3]]);
	};


	function RenderLines(edge : Types.T_ModelMesh_Edge<Types.T_ModelMesh_Vertex>) : void
	{
		function DrawLinePointsOnCanvas(
			linePointsCoord : Coord.Types.T_Coord2D[],
			color           : Color.RGB.Types.T_Color,
		): void
		{
			const canvasWidth : number = context.canvas.width;
			const colorRed    : number = color.red;
			const colorGreen  : number = color.green;
			const colorBlue   : number = color.blue;

			linePointsCoord.map((linePointCoord:Coord.Types.T_Coord2D): void => { FillPixelBuffer(buffer, canvasWidth, linePointCoord.x, linePointCoord.y, colorRed, colorGreen, colorBlue); });	
		};

		DrawLinePointsOnCanvas(Line.Utils.GetLinePointsCoord(line.coord), line.color);
	};

	if (canvas != null)
	{
		const context : CanvasRenderingContext2D|null = canvas.getContext("2d");
		
		if (context)
		{
			//const timeStart : Date = new Date();

			const imagedata : ImageData = context.createImageData(context.canvas.width, context.canvas.height);

			//const timeAfterImageDataCreation : Date = new Date();
			//console.log("Time To prepare buffer: ", (timeAfterImageDataCreation.getTime() - timeStart.getTime()) );

			const cameraToWorldMatrix      : Matrix.Types.T_Matrix_4_4 = Rasterizer.PolarCamera.Utils.GenerateCamera_ToWorldMatrix(camera);
			const worldToCameraMatrix      : Matrix.Types.T_Matrix_4_4 = Matrix.Utils.InverseMatrix(cameraToWorldMatrix, 4);
			const rotationAndScalingMatrix : Matrix.Types.T_Matrix_3_3 = ExtractRotateAndScaleMatrix_FromWorldToCameraMatrix(worldToCameraMatrix);
			const translationVector        : Vector.Types.T_Vec3D      = ExtractTranslateVector_FromWorldToCameraMatrix(worldToCameraMatrix);

			const canvasWidth  : number = context.canvas.width;
			const canvasHeight : number = context.canvas.height;
			const cameraRaduis : number = camera.polarCoord.radius;

			//const timeCreationMatrices : Date = new Date();
			//console.log("Time To create Matrices: ", (timeCreationMatrices.getTime() - timeAfterImageDataCreation.getTime()) );
		
			let modelEdgesWithVertices : Types.T_ModelMesh_Edges<Types.T_ModelMesh_Vertex> = [];

			if (coordinateSystemBases)
			{
				const newCoordinateSystemBases : Types.T_CoordinateBases3D =
				{
					...coordinateSystemBases,
					vertices: FromWorldSpace_ToDisplaySpace(
						coordinateSystemBases.vertices ?? [],
						rotationAndScalingMatrix,
						translationVector,
						cameraRaduis,
						canvasWidth,
						canvasHeight,
					) as Types.T_CoordinateBases3D_Vertices,
				};

				modelEdgesWithVertices = [...modelEdgesWithVertices, ...FromEdgesIndex_ToEdgesVertices(newCoordinateSystemBases.edges, newCoordinateSystemBases.vertices)];
			}
			if (mesh)
			{
				const newMesh : Types.T_ModelMesh<number> =
				{
					...mesh,
					vertices: FromWorldSpace_ToDisplaySpace(
						mesh.vertices ?? [],
						rotationAndScalingMatrix,
						translationVector,
						cameraRaduis,
						canvasWidth,
						canvasHeight,
					),
				};

				modelEdgesWithVertices = [...modelEdgesWithVertices, ...FromEdgesIndex_ToEdgesVertices(newMesh.edges, newMesh.vertices)];
			}

			//let timeToRenderBackground : Date | undefined = undefined;

			if (background)
			{
				RenderCanvasBackground (imagedata.data, context, background);
				//timeToRenderBackground = new Date();
				//console.log("Time To render background: ", (timeToRenderBackground.getTime() - timeToCalculateLineToRenderInDisplay.getTime()) );
			}

			modelEdgesWithVertices
			.filter(RemoveEdgesOutOfCanvas(canvasWidth, canvasHeight))
			.sort  (SortLineToGetLineRestpectDeepness)
			.map   (RenderLines);

			//const timeCalculateCoordinateSystemInCameraSpace : Date = new Date();
			//console.log("Time To calculate coord system in Camera Space: ", (timeCalculateCoordinateSystemInCameraSpace.getTime() - timeCreationMatrices.getTime()) );

			//const meshLines         : Line.Types.T_ColoredLine<Line.Types.T_Line3D>[] = Polygone.Utils.FromColoredPolygones_ToColoredLines(mesh ?? []);

			//const timeToGoFromPolygonesToLines : Date = new Date();
			//console.log("From Polygone to Lines", (timeToGoFromPolygonesToLines.getTime() - timeCalculateCoordinateSystemInCameraSpace.getTime()));

			//const timeCalculateMeshModelInCameraSpace : Date = new Date();
			//console.log("Time To calculate mesh model in Camera Space: ", (timeCalculateMeshModelInCameraSpace.getTime() - timeCalculateCoordinateSystemInCameraSpace.getTime()) );

			//const timeToCalculateLineToRenderInDisplay : Date = new Date();
			//console.log("Time To calculate lines to render in display: ", (timeToCalculateLineToRenderInDisplay.getTime() - timeCalculateMeshModelInCameraSpace.getTime()) );
			

			//const timeToRenderAllLines : Date = new Date();
			//if (timeToRenderBackground) console.log("Time To render line (background): "   , (timeToRenderAllLines.getTime() - timeToRenderBackground.getTime()) );
			//else                        console.log("Time To render line (no background): ", (timeToRenderAllLines.getTime() - timeToCalculateLineToRenderInDisplay.getTime()) );

			context.putImageData(imagedata, 0, 0);

			//const putBuggerInCanvas : Date = new Date();
			//console.log("Put buffer in canvas: ", (putBuggerInCanvas.getTime() - timeToRenderAllLines.getTime()) );

			UpdateCamera(camera, cameraToWorldMatrix, worldToCameraMatrix);
		}
	}
};
