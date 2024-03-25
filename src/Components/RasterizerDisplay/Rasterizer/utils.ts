import * as Rasterizer from "../../../Utils/Rasterizer";
import * as Matrix     from "../../../Utils/Matrix";
import * as Coord      from "../../../Utils/Coord";
import * as Color      from "../../../Utils/Color";
import * as Vector     from "../../../Utils/Vector";
import * as Bresenham  from "../../../Utils/Bresenham";

import * as Types from "./types";


/********************* Prepare Vertices *********************/

function Transformation_3_3(
	vector : Vector.Types.T_Vec3D,
	matrix : Matrix.Types.T_Matrix_3_3,
): void
{
	const newVectorX : number = (matrix[0][0] * vector[0]) + (matrix[0][1] * vector[1]) + (matrix[0][2] * vector[2]);
	const newVectorY : number = (matrix[1][0] * vector[0]) + (matrix[1][1] * vector[1]) + (matrix[1][2] * vector[2]);
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
	vector1[0] += vector2[0];
	vector1[1] += vector2[1];
	vector1[2] += vector2[2];
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

/*
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
*/

export function MergeMeshes(meshes : (Types.T_ModelMesh<number> | undefined)[]) : Types.T_ModelMesh<number>
{
	let result : Types.T_ModelMesh<number> = { edges: [], vertices: [] };

	for (const mesh of meshes)
	{
		if (mesh)
		{
			result.edges =
			[
				...result.edges,
				...mesh.edges.map((edge : Types.T_ModelMesh_Edge<number> | null) : Types.T_ModelMesh_Edge<number> | null =>
				{
					if (edge) return ({...edge, edge: [edge.edge[0] + result.vertices.length, edge.edge[1] + result.vertices.length] })
					else      return (null);
				})
			];
			result.vertices = [...result.vertices, ...mesh.vertices];
		}
	}

	return (result);
};

function RemoveEdgesOutOfCanvas(
	allModelMesh : Types.T_ModelMesh<number>,
	canvasWidth  : number,
	canvasHeight : number,
) : void
{
	for (let i : number = 0; i < allModelMesh.edges.length; ++i)
	{
		const edges : Types.T_ModelMesh_Edge<number> | null = allModelMesh.edges[i];

		if (edges)
		{
			const vertex1 : Types.T_ModelMesh_Vertex = allModelMesh.vertices[edges.edge[0]];
			const vertex2 : Types.T_ModelMesh_Vertex = allModelMesh.vertices[edges.edge[1]];

			const edgeUpdateResult : [Types.T_ModelMesh_Vertex,number] | boolean =  RemoveEdgesPartOutsideOfCanvas(
					vertex1[0], vertex1[1], vertex1[2],
					vertex2[0], vertex2[1], vertex2[2],
					canvasWidth,
					canvasHeight
				);

			if (typeof edgeUpdateResult === "boolean" && !edgeUpdateResult) allModelMesh.edges[i] = null;
			else
			{
				if (Array.isArray(edgeUpdateResult))
				{
					edges.edge[edgeUpdateResult[1] - 1] = allModelMesh.vertices.length;
					allModelMesh.vertices.push(edgeUpdateResult[0]);
				}
			}
		}
	}
};

function RemoveEdgesPartOutsideOfCanvas(
	vertex1X     : number,
	vertex1Y     : number,
	vertex1Z     : number,
	vertex2X     : number,
	vertex2Y     : number,
	vertex2Z     : number,
	canvasWidth  : number,
	canvasHeight : number,
) : [Types.T_ModelMesh_Vertex,number] | boolean
{
	function IsVertexOutOfCanvas(
		vertexX : number,
		vertexY : number,
	) : Types.E_CanvasAreas
	{
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
		vertexXOut : number,
		vertexYOut : number,
		vertexZOut : number,
		vertexXIn  : number,
		vertexYIn  : number,
		limit      : number,
	) : Vector.Types.T_Vec3D
	{
		const vectorFactor : number = (limit - vertexYIn) / (vertexYOut - vertexYIn);

		return (
			[
				Math.floor(vertexXIn + ((vertexXOut - vertexXIn) * vectorFactor)),
				limit,
				vertexZOut,
			]
		);
	};

	function GetNewLineInCanvas_Horizontal(
		vertexXOut : number,
		vertexYOut : number,
		vertexZOut : number,
		vertexXIn  : number,
		vertexYIn  : number,
		limit      : number,
	) : Vector.Types.T_Vec3D
	{
		const vectorFactor : number = (limit - vertexXIn) / (vertexXOut - vertexXIn);

		return (
			[
				limit,
				Math.floor(vertexYIn + ((vertexYOut - vertexYIn) * vectorFactor)),
				vertexZOut,
			]
		);
	};

	function GetNewLineInCanvas_Diagonal(
		vertexXOut      : number,
		vertexYOut      : number,
		vertexZOut      : number,
		vertexXIn       : number,
		vertexYIn       : number,
		limitHorizontal : number,
		limitVertical   : number,
	) : Vector.Types.T_Vec3D
	{
		const vectorFactor_Horizontal : number = (limitHorizontal - vertexXIn) / (vertexXOut - vertexXIn);
		const vectorFactor_Vertical   : number = (limitVertical   - vertexYIn) / (vertexYOut - vertexYIn);

		return (
			[
				(vectorFactor_Horizontal > vectorFactor_Vertical) ? Math.floor(vertexXIn + ((vertexXOut - vertexXIn) * vectorFactor_Vertical))   : limitHorizontal,
				(vectorFactor_Horizontal < vectorFactor_Vertical) ? Math.floor(vertexYIn + ((vertexYOut - vertexYIn) * vectorFactor_Horizontal)) : limitVertical,
				vertexZOut
			]
		);
	};

	const vertex1LocationRelativeToCanvas : Types.E_CanvasAreas = IsVertexOutOfCanvas(vertex1X, vertex1Y);
	const vertex2LocationRelativeToCanvas : Types.E_CanvasAreas = IsVertexOutOfCanvas(vertex2X, vertex2Y);

	if      (vertex1LocationRelativeToCanvas !== Types.E_CanvasAreas.IN && vertex2LocationRelativeToCanvas !== Types.E_CanvasAreas.IN) return (false);
	else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.IN && vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.IN) return (true);
	else 
	{
		if      (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT        ) return ([GetNewLineInCanvas_Horizontal(vertex1X, vertex1Y, vertex1Z, vertex2X, vertex2Y, 0                         ), 1]);
		else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_TOP         ) return ([GetNewLineInCanvas_Vertical  (vertex1X, vertex1Y, vertex1Z, vertex2X, vertex2Y, 0                         ), 1]);
		else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT       ) return ([GetNewLineInCanvas_Horizontal(vertex1X, vertex1Y, vertex1Z, vertex2X, vertex2Y, canvasWidth               ), 1]);
		else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_BOTTOM      ) return ([GetNewLineInCanvas_Vertical  (vertex1X, vertex1Y, vertex1Z, vertex2X, vertex2Y, canvasHeight              ), 1]);
		else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT_TOP    ) return ([GetNewLineInCanvas_Diagonal  (vertex1X, vertex1Y, vertex1Z, vertex2X, vertex2Y, 0           , 0           ), 1]);
		else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT_TOP   ) return ([GetNewLineInCanvas_Diagonal  (vertex1X, vertex1Y, vertex1Z, vertex2X, vertex2Y, canvasWidth , 0           ), 1]);
		else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT_BOTTOM) return ([GetNewLineInCanvas_Diagonal  (vertex1X, vertex1Y, vertex1Z, vertex2X, vertex2Y, canvasWidth , canvasHeight), 1]);
		else if (vertex1LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT_BOTTOM ) return ([GetNewLineInCanvas_Diagonal  (vertex1X, vertex1Y, vertex1Z, vertex2X, vertex2Y, 0           , canvasHeight), 1]);
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT        ) return ([GetNewLineInCanvas_Horizontal(vertex2X, vertex2Y, vertex2Z, vertex1X, vertex1Y, 0                         ), 2]);
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_TOP         ) return ([GetNewLineInCanvas_Vertical  (vertex2X, vertex2Y, vertex2Z, vertex1X, vertex1Y, 0                         ), 2]);
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT       ) return ([GetNewLineInCanvas_Horizontal(vertex2X, vertex2Y, vertex2Z, vertex1X, vertex1Y, canvasWidth               ), 2]);
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_BOTTOM      ) return ([GetNewLineInCanvas_Vertical  (vertex2X, vertex2Y, vertex2Z, vertex1X, vertex1Y, canvasHeight              ), 2]);
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT_TOP    ) return ([GetNewLineInCanvas_Diagonal  (vertex2X, vertex2Y, vertex2Z, vertex1X, vertex1Y, 0           , 0           ), 2]);
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT_TOP   ) return ([GetNewLineInCanvas_Diagonal  (vertex2X, vertex2Y, vertex2Z, vertex1X, vertex1Y, canvasWidth , 0           ), 2]);
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_RIGHT_BOTTOM) return ([GetNewLineInCanvas_Diagonal  (vertex2X, vertex2Y, vertex2Z, vertex1X, vertex1Y, canvasWidth , canvasHeight), 2]);
		else if (vertex2LocationRelativeToCanvas === Types.E_CanvasAreas.OUT_LEFT_BOTTOM ) return ([GetNewLineInCanvas_Diagonal  (vertex2X, vertex2Y, vertex2Z, vertex1X, vertex1Y, 0           , canvasHeight), 2]);

		return (true);
	}
};

function SortLineToGetLineRestpectDeepness(vertices : Types.T_ModelMesh_Vertices) : Types.T_ModelMesh_Vertices
{
	return (
		vertices.sort((vertex1 : Types.T_ModelMesh_Vertex, vertex2 : Types.T_ModelMesh_Vertex) : number =>
		{
			const averageZDepthLine1 : number = (vertex1[2] + vertex2[2]) * 0.5;
			const averageZDepthLine2 : number = (vertex1[2] + vertex2[2]) * 0.5;
		
			if      (averageZDepthLine1 > averageZDepthLine2) return (-1);
			else if (averageZDepthLine1 < averageZDepthLine2) return (1);
			else                                              return (0);
		})
	);
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

function RenderLines(
	buffer       : Uint8ClampedArray,
	canvasWidth  : number,
	allModelMesh : Types.T_ModelMesh<number>,
) : void
{
	function DrawLinePointsOnCanvas(
		linePointsCoord : Vector.Types.T_Vec2D[],
		color           : Color.RGB.Types.T_Color,
	) : void
	{
		const colorRed   : number = color.red;
		const colorGreen : number = color.green;
		const colorBlue  : number = color.blue;

		linePointsCoord.map((linePointCoord : Vector.Types.T_Vec2D) : void =>
		{
			FillPixelBuffer(buffer, canvasWidth, linePointCoord[0], linePointCoord[1], colorRed, colorGreen, colorBlue);
		});	
	};

	for (const edges of allModelMesh.edges)
	{
		if (edges)
		{
			const vertex1 : Types.T_ModelMesh_Vertex = allModelMesh.vertices[edges.edge[0]];
			const vertex2 : Types.T_ModelMesh_Vertex = allModelMesh.vertices[edges.edge[1]];
		
			DrawLinePointsOnCanvas(Bresenham.Utils.BresenhamLinePoints(vertex1[0], vertex1[1], vertex2[0], vertex2[1]), edges.color);
		}
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

export function GenerateCoordinateBases3D(baseSize : number) : Types.T_CoordinateBases3D
{
	return (
		{
			vertices :
			[
				[0       ,0        ,0       ],
				[baseSize,0        ,0       ],
				[0       ,baseSize,0        ],
				[0       ,0        ,baseSize],
			],
			edges:
			[
				{ edge: [0,1], color: { red: 255, green:   0, blue:   0 } },
				{ edge: [0,2], color: { red:   0, green: 255, blue:   0 } },
				{ edge: [0,3], color: { red:   0, green:   0, blue: 255 } },
			]
		}
	);
};

export function RenderFrame(
	canvas                  : HTMLCanvasElement | undefined,
	camera                  : Types.T_CameraState,
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

	if (canvas != null)
	{
		const context : CanvasRenderingContext2D|null = canvas.getContext("2d");
		
		if (context)
		{
			const start = new Date();

			const canvasWidth  : number = context.canvas.width;
			const canvasHeight : number = context.canvas.height;
			const cameraRaduis : number = camera.polarCoord.radius;

			const imagedata : ImageData = context.createImageData(canvasWidth, canvasHeight);

			const cameraToWorldMatrix      : Matrix.Types.T_Matrix_4_4 = Rasterizer.PolarCamera.Utils.GenerateCamera_ToWorldMatrix(camera);
			const worldToCameraMatrix      : Matrix.Types.T_Matrix_4_4 = Matrix.Utils.InverseMatrix(cameraToWorldMatrix, 4);
			const rotationAndScalingMatrix : Matrix.Types.T_Matrix_3_3 = ExtractRotateAndScaleMatrix_FromWorldToCameraMatrix(worldToCameraMatrix);
			const translationVector        : Vector.Types.T_Vec3D      = ExtractTranslateVector_FromWorldToCameraMatrix(worldToCameraMatrix);
		
			if  (mesh)
			{
				let allModelMesh : Types.T_ModelMesh<number> =
				{
					edges   : mesh?.edges.map((edge : Types.T_ModelMesh_Edge<number> | null) =>
					{ 
						if (edge) return ({ color: edge.color, edge: [edge.edge[0],edge.edge[1]] })
						else      return (null);
					}) ?? [],
					vertices: FromWorldSpace_ToDisplaySpace(
							mesh.vertices ?? [],
							rotationAndScalingMatrix,
							translationVector,
							cameraRaduis,
							canvasWidth,
							canvasHeight
						),
				};

				RemoveEdgesOutOfCanvas           (allModelMesh, canvasWidth, canvasHeight);
				SortLineToGetLineRestpectDeepness(allModelMesh.vertices);
				
				if (background)
					RenderCanvasBackground (imagedata.data, context, background);
	
				RenderLines(imagedata.data, canvasWidth, allModelMesh);
	
				context.putImageData(imagedata, 0, 0);
			}

			const end = new Date();
			console.log(end.getTime() - start.getTime());
			UpdateCamera(camera, cameraToWorldMatrix, worldToCameraMatrix);
		}
	}
};
