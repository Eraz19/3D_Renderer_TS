import * as Types from "./types";
import * as Coord from "../../Coord";
import * as Line  from "../Line";
import * as Color from "../../Color";


export function IsPolygone_2(polygone : Types.T_Polygone): polygone is Types.T_Polygone2D { return (polygone.length !== 0 && Coord.Utils.IsCoord_2(polygone[1])); };
export function IsPolygone_3(polygone : Types.T_Polygone): polygone is Types.T_Polygone3D { return (polygone.length !== 0 && Coord.Utils.IsCoord_3(polygone[1])); };

export function FromPolygones_ToLines(polygones : Types.T_Polygone3D[]): Line.Types.T_Line3D[]
{
	return (
		polygones
		.map(FromPolygone_ToLines)
		.reduce((prev : Line.Types.T_Line3D[], current : Line.Types.T_Line3D[] ) => 
		{
			return ([...prev, ...current]);
		}, [])
	);
};

export function FromPolygone_ToLines(polygone : Types.T_Polygone3D): Line.Types.T_Line3D[]
{
	let result : Line.Types.T_Line3D[] = [];

	for (let i : number = 0; i < polygone.length; ++i)
	{
		if (i < polygone.length - 1) result = [...result, { start: polygone[i], end: polygone[i + 1] }];
		else                         result = [...result, { start: polygone[i], end: polygone[0]     }];
	}

	return (result);
};

export function FromColoredPolygones_ToColoredLines(
	polygones : Types.T_ColoredPolygone<Types.T_Polygone3D>[],
) : Line.Types.T_ColoredLine<Line.Types.T_Line3D>[]
{
	return (
		polygones.map((polygone : Types.T_ColoredPolygone<Types.T_Polygone3D>) =>
		{
			return(
				FromPolygone_ToLines(polygone.coord)
				.map((line : Line.Types.T_Line3D) : Line.Types.T_ColoredLine<Line.Types.T_Line3D> =>
				{
					return ({ coord: line, color: polygone.color });
				})
			);
		})
		.reduce((prev : Line.Types.T_ColoredLine<Line.Types.T_Line3D>[], current : Line.Types.T_ColoredLine<Line.Types.T_Line3D>[] ) => 
		{
			return ([...prev, ...current]);
		}, [])
	);
};

export function FromPolygones_ToColoredPolygones(
	polygones  : Types.T_Polygone3D[],
	color     ?: Color.RGB.Types.T_Color,
): Types.T_ColoredPolygone<Types.T_Polygone3D>[]
{
	return (
		polygones.map((polygone : Types.T_Polygone3D): Types.T_ColoredPolygone<Types.T_Polygone3D> =>
		{
			return (FromPolygone_ToColoredPolygone(polygone, color));
		})
	);
};

export function FromPolygone_ToColoredPolygone(
	polygone : Types.T_Polygone3D,
	color?    : Color.RGB.Types.T_Color,
): Types.T_ColoredPolygone<Types.T_Polygone3D>
{
	return ({ color: color ?? { red: 0, green: 0, blue: 0 }, coord: polygone });
};
