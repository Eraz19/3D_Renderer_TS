import * as Coord    from "../Coord";
import * as Vector   from "../Vector";
import * as Polygone from "../Shapes/Polygone";


function FromStringOBJ_ToPoint(str : string): Coord.Types.T_Coord3D
{
	const splitStr : string[] = str.split(' ').splice(1);

	if (splitStr.length >= 3) return ({ x: Number(splitStr[0]), y: Number(splitStr[1]), z: Number(splitStr[2]) });
	else                      return ({ x: NaN, y: NaN, z: NaN });
};

function FromStringOBJ_ToPolygone(
	str      : string,
	vertices : Coord.Types.T_Coord3D[],
): Polygone.Types.T_Polygone3D
{
	function FromOBJPoligonalFace_ToVerticesIndex(str : string): number
	{
		const splitStr : string[] = str.split('/');

		if (splitStr.length >= 1) return (Number(splitStr[0]));
		else                      return (NaN);
	};
	function FromVerticesIndex_ToPolygone(
		verticesIndex : Vector.Types.T_Vec3D,
		vertices      : Coord.Types.T_Coord3D[],
	): Polygone.Types.T_Polygone3D
	{
		let result : Polygone.Types.T_Polygone3D = [];

		for (const vertexIndex of verticesIndex)
		{
			if (vertexIndex - 1 < vertices.length)
				result = [...result, vertices[vertexIndex - 1]];
		}

		return (result as Polygone.Types.T_Polygone3D);
	};

	const splitStr : string[] = str.split(' ').splice(1);

	if (splitStr.length >= 3) return (FromVerticesIndex_ToPolygone(splitStr.map(FromOBJPoligonalFace_ToVerticesIndex) as Vector.Types.T_Vec3D, vertices));
	else                      return ([]);
};

export function ParseOBJFile(fileContent : string): Polygone.Types.T_Polygone3D[]
{
	function IsLinePointCoord   (line : string): boolean { return (line.startsWith("v ")); };
	function IsLinePolygonalFace(line : string): boolean { return (line.startsWith("f ")); };

	const splitLines : string[] = fileContent.split('\n');
	
	let pointStringList         : string[] = [];
	let polygonalFaceStringList : string[] = [];

	for (const line of splitLines)
	{
		if      (IsLinePointCoord(line))    pointStringList         = [...pointStringList        , line];
		else if (IsLinePolygonalFace(line)) polygonalFaceStringList = [...polygonalFaceStringList, line];
	}

	const vertices  : Coord.Types.T_Coord3D[]       = pointStringList.map(FromStringOBJ_ToPoint);
	const polygones : Polygone.Types.T_Polygone3D[] = polygonalFaceStringList.map((str:string):Polygone.Types.T_Polygone3D =>
		{
			return (FromStringOBJ_ToPolygone(str, vertices));
		});

	return (polygones);
};
