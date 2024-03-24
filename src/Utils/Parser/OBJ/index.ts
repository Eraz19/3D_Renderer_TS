import * as Vector from "../../Vector";

import * as Types from "./types"


function FromLineFace_ToEdges(str : string): Types.T_Edges
{
	function FromLineFace_ToVerticesIndex(str : string): number
	{
		const splitStr : string[] = str.split('/');

		if (splitStr.length >= 1) return (Number(splitStr[0]) - 1);
		else                      return (NaN);
	};

	function FromVerticesIndex_ToEdges(verticesList : number[]) : Types.T_Edges
	{
		function SortVerticesIndex(value1 : number, value2 : number) : number
		{
			return ((value1 > value2) ? 1 : -1);
		};

		let result : Types.T_Edges = [];

		for (let i : number = 0; i < verticesList.length; ++i)
		{
			if (i < verticesList.length - 1) result = [...result, [verticesList[i],verticesList[i + 1]].sort(SortVerticesIndex) as [number, number]];
			else                             result = [...result, [verticesList[i],verticesList[0]    ].sort(SortVerticesIndex) as [number, number]];
		}

		return (result);
	};

	const splitStr : string[] = str.split(' ').splice(1);

	if (splitStr.length >= 3) return (FromVerticesIndex_ToEdges(splitStr.map(FromLineFace_ToVerticesIndex)));
	else                      return ([]);
};

export function ParseOBJFile(fileContent : string) : Types.T_OBJParsingResult
{
	function FromStringOBJ_ToPoint(str : string): Vector.Types.T_Vec3D
	{
		const splitStr : string[] = str.split(' ').splice(1);

		if (splitStr.length >= 3) return ([Number(splitStr[0]),Number(splitStr[1]),Number(splitStr[2])]);
		else                      return ([NaN                ,NaN                ,NaN                ]);
	};

	function CollectAllEdgesArraysInOneArray(
		prev    : Types.T_Edges,
		current : Types.T_Edges,
	) : Types.T_Edges
	{
		return ([...prev, ...current]);
	};
	
	function SortEdges(edge1 : Types.T_Edge, edge2 : Types.T_Edge) : number
	{
		return ((edge1[0] > edge2[0]) ? 1 : -1);
	};

	function RemoveAllDuplicatesEdges(edges : Types.T_Edges) : Types.T_Edges
	{
		if (edges.length !== 0)
		{
			let result : Types.T_Edges = [edges[0]];

			for (let i : number = 1; i < edges.length; ++i)
			{
				const lastEdgeIndex1 : number = result[result.length - 1][0];
				const lastEdgeIndex2 : number = result[result.length - 1][1];

				if (edges[i][0] !== lastEdgeIndex1 || edges[i][1] !== lastEdgeIndex2)
					result = [...result, edges[i]];
			}

			return (result);
		}
		else
			return (edges);
	};

	function IsLineVertexCoord(line : string): boolean { return (line.startsWith("v ")); };
	function IsLineFace       (line : string): boolean { return (line.startsWith("f ")); };

	const splitLines : string[] = fileContent.split('\n');
	
	let verticesStringList : string[] = [];
	let faceStringList     : string[] = [];

	for (const line of splitLines)
	{
		if      (IsLineVertexCoord(line)) verticesStringList = [...verticesStringList, line];
		else if (IsLineFace       (line)) faceStringList     = [...faceStringList    , line];
	}	

	return (
		{
			vertices: verticesStringList.map(FromStringOBJ_ToPoint),
			edges   : RemoveAllDuplicatesEdges(faceStringList
				.map(FromLineFace_ToEdges)
				.reduce(CollectAllEdgesArraysInOneArray, [])
				.sort(SortEdges))
		}
	);
};

export * as Types from "./types";
