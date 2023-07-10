import * as Types from "./types";
import * as Coord from "../../Coord";
import * as Line  from "../Line";
import * as Color from "../../Color";


export function IsPolygone_2(polygone : Types.T_Polygone): polygone is Types.T_Polygone2D { return (polygone.length !== 0 && Coord.Utils.IsCoord_2(polygone[1])); };
export function IsPolygone_3(polygone : Types.T_Polygone): polygone is Types.T_Polygone3D { return (polygone.length !== 0 && Coord.Utils.IsCoord_3(polygone[1])); };

export function GetPolygonePointsCoord(polygone : Types.T_Polygone2D): Coord.Types.T_Coord2D[]
{
	let result : Coord.Types.T_Coord2D[] = [];

	for (let i : number = 0; i < polygone.length; ++i)
	{
		if (i < polygone.length - 1) result = [...result, ...Line.Utils.GetLinePointsCoord({ start: polygone[i], end: polygone[i + 1] })];
		else                         result = [...result, ...Line.Utils.GetLinePointsCoord({ start: polygone[i], end: polygone[0] })];
	}

	return (result);
};

export function FromPolygones_ToColoredPolygones(
	polygones : Types.T_Polygone3D[],
	color?    : Color.RGB.Types.T_Color,
): Types.T_ColoredPolygone<Types.T_Polygone3D>[]
{
	return (polygones.map((polygone:Types.T_Polygone3D) => { return (FromPolygone_ToColoredPolygone(polygone, color)); }));
};
function FromPolygone_ToColoredPolygone(
	polygone : Types.T_Polygone3D,
	color?   : Color.RGB.Types.T_Color,
): Types.T_ColoredPolygone<Types.T_Polygone3D>
{
	const defaultColor : Color.RGB.Types.T_Color = { red: 0, green: 0, blue: 0 };

	return (
		{
			color: (color) ? color : defaultColor,
			coord: polygone,
		}
	);
};
