import * as Vector from "../../Vector";

import * as Types from "./types"


function FromLineFace_ToEdges(str : string): Types.T_Edges
{
	function FromLineFace_ToVerticesIndex(str : string): number
	{
		const splitStr : string[] = str.split('/');

		if (splitStr.length >= 1) return (Number(splitStr[0]));
		else                      return (NaN);
	};

	function FromVerticesIndex_ToEdges(verticesList : number[]) : Types.T_Edges
	{
		let result : Types.T_Edges = [];

		for (let i : number = 0; i < verticesList.length; ++i)
		{
			if (i < verticesList.length - 1) result = [...result, [verticesList[i],verticesList[i + 1]]];
			else                             result = [...result, [verticesList[i],verticesList[0]    ]];
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
	
	function RemoveAllDuplicatesEdges(
		edge     : Types.T_Edge,
		index    : number,
		allEdges : Types.T_Edges,
	) : boolean
	{
		const originalEdge                : Types.T_Edge = edge;
		const reverseEdge                 : Types.T_Edge = [edge[1],edge[0]];
		const edgeMatchingIndexInAllEdges : number       = allEdges.findIndex((edgeInList : Types.T_Edge) : boolean =>
			{
				return (
					(JSON.stringify(edgeInList) === JSON.stringify(originalEdge)) ||
					(JSON.stringify(edgeInList) === JSON.stringify(reverseEdge))  &&
					edgeInList !== edge
				);
			});

		return (index === edgeMatchingIndexInAllEdges);
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
			edges   : faceStringList
				.map(FromLineFace_ToEdges)
				.reduce(CollectAllEdgesArraysInOneArray, [])
				.filter(RemoveAllDuplicatesEdges)
		}
	);
};

export * as Types from "./types";
