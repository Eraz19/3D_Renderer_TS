import * as Point    from "eraz-lib/build/Graphic/Point";
import * as Polygone from "eraz-lib/build/Graphic/Polygone";


function IsLinePointCoord(line:string):boolean    { return (line.startsWith("v ")); };
function IsLinePolygonalFace(line:string):boolean { return (line.startsWith("f ")); };

function FromStringOBJ_ToPoint(str:string):Point.Types.T_Point3D
{
	const splitStr:string[] = str.split(' ').splice(1);

	if (splitStr.length >= 3) return ([Number(splitStr[0]),Number(splitStr[1]),Number(splitStr[2])]);
	else                      return ([NaN,NaN,NaN]);
};

function FromStringOBJ_ToPolygone(str:string, points:Point.Types.T_Point3D[]):Polygone.Types.T_Polygone3D
{
	function FromOBJPoligonalFace_ToVerticesIndex(str:string):number
	{
		const splitStr:string[] = str.split('/');

		if (splitStr.length >= 1) return (Number(splitStr[0]));
		else                      return (NaN);
	};
	function FromVerticesIndex_ToPolygone(verticesIndex:Point.Types.T_Point3D, points:Point.Types.T_Point3D[]):Polygone.Types.T_Polygone3D
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
		return (FromVerticesIndex_ToPolygone(splitStr.map(FromOBJPoligonalFace_ToVerticesIndex) as Point.Types.T_Point3D, points));
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

	const points:Point.Types.T_Point3D[]          = pointStringList.map(FromStringOBJ_ToPoint);
	const polygones:Polygone.Types.T_Polygone3D[] = polygonalFaceStringList.map((str:string):Polygone.Types.T_Polygone3D =>
		{
			return (FromStringOBJ_ToPolygone(str, points));
		});

	return (polygones);
};
