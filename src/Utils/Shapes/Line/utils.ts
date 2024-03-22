import * as Types     from "./types";
import * as Coord     from "../../Coord";
import * as Bresenham from "../../Bresenham";
import * as Color     from "../../Color";


export function DeltaX(line : Types.T_Line  ) : number { return (line.end.x - line.start.x); };
export function DeltaY(line : Types.T_Line  ) : number { return (line.end.y - line.start.y); };
export function DeltaZ(line : Types.T_Line3D) : number { return (line.end.z - line.start.z); };

export function GetLinePointsCoord(line : Types.T_Line2D) : Coord.Types.T_Coord2D[]
{
    return (Bresenham.Utils.BresenhamLinePoints(line));
};

export function FromLines_ToColoreLines(
	lines  : Types.T_Line3D[],
	color ?: Color.RGB.Types.T_Color,
): Types.T_ColoredLine<Types.T_Line3D>[]
{
	return (
        lines.map((line : Types.T_Line3D) : Types.T_ColoredLine<Types.T_Line3D> =>
        {
            return (FromLine_ToColoreLine(line, color));
        })
    );
};

export function FromLine_ToColoreLine(
    line   : Types.T_Line3D,
	color ?: Color.RGB.Types.T_Color,
): Types.T_ColoredLine<Types.T_Line3D>
{
    return ({ color: color ?? { red: 0, green: 0, blue: 0 }, coord: line });
};

