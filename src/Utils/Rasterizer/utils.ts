import * as Polygone from "../Shapes/Polygone";
import * as Line     from "../Shapes/Line";
import * as Coord    from "../Coord";
import * as Matrix   from "../Matrix";
import * as Types    from "./types";


export function FromWorldSpace_ToCameraSpace_CoordSystemBases(
	cameraMatrix          : Matrix.Types.T_Matrix_4_4,
	coordinateSystemBases : Types.T_CoordinateBases_3D,
): Types.T_CoordinateBases_3D
{
	function FromCoordWorld_ToCoordCamera(coord : Coord.Types.T_Coord3D): Coord.Types.T_Coord3D
	{
		const newCoord:Coord.Types.T_Coord4D = Matrix.Utils.Transformation(cameraMatrix, { ...coord, w: 1 });

		return ({ x: newCoord.x, y: newCoord.y, z: newCoord.z });
	};

	function FromLineWorld_ToLineCamera(line : Line.Types.T_ColoredLine<Line.Types.T_Line3D>): Line.Types.T_ColoredLine<Line.Types.T_Line3D>
	{
		return (
			{
				color: line.color,
				coord:
				{
					start: FromCoordWorld_ToCoordCamera(line.coord.start),
					end  : FromCoordWorld_ToCoordCamera(line.coord.end),
				}
			}
		);
	};

	return (
		coordinateSystemBases.map((line : Line.Types.T_ColoredLine<Line.Types.T_Line3D>): Line.Types.T_ColoredLine<Line.Types.T_Line3D> =>
		{
			return (FromLineWorld_ToLineCamera(line));
		}) as Types.T_CoordinateBases_3D
	);
};

export function FromWorldSpace_ToCameraSpace_Mesh(
	cameraMatrix : Matrix.Types.T_Matrix_4_4,
	mesh         : Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[],
) : Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[]
{
	function FromCoordWorld_ToCoordCamera(coord : Coord.Types.T_Coord3D): Coord.Types.T_Coord3D
	{
		const newCoord:Coord.Types.T_Coord4D = Matrix.Utils.Transformation(cameraMatrix, { ...coord, w: 1 });

		return ({ x: newCoord.x, y: newCoord.y, z: newCoord.z });
	};

	function FromPolygoneWorld_ToPolygoneCamera(polygone : Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>): Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>
	{
		return (
			{
				color: polygone.color,
				coord: polygone.coord.map((coord : Coord.Types.T_Coord3D): Coord.Types.T_Coord3D =>
				{
					return (FromCoordWorld_ToCoordCamera(coord));
				})
			}
		);
	};

	return (
		mesh.map((polygone : Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>): Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D> =>
		{
			return (FromPolygoneWorld_ToPolygoneCamera(polygone));
		})
	);
};

export function PolygoneFromCameraSpace_ToDisplaySpace_Polygone(
	polygone     : Polygone.Types.T_Polygone3D,
	cameraRadius : number,
) : Coord.Types.T_Coord2D[]
{
	return (polygone.map((coord : Coord.Types.T_Coord3D) : Coord.Types.T_Coord2D => { return (FromCameraSpace_ToDisplaySpace_Coord(coord, cameraRadius)); }));
};

export function FromCameraSpace_ToDisplaySpace_Coord(
	coord        : Coord.Types.T_Coord3D,
	cameraRadius : number,
): Coord.Types.T_Coord2D
{
	return (Matrix.Utils.Transformation([[0,cameraRadius,0],[0,0,cameraRadius]], coord));
};

export function CenterDisplayOrigin(
	coord         : Coord.Types.T_Coord2D,
	displayWidth  : number,
	displayHeight : number,
):Coord.Types.T_Coord2D
{
	return ({ x: Math.floor(coord.x + displayWidth * .5), y: Math.floor(-coord.y + displayHeight * .5) });
};
