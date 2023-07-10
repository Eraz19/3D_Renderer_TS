import * as Types     from "./types";
import * as Coord     from "../../Coord";
import * as Bresenham from "../../Bresenham";


export function DeltaX(line : Types.T_Line  ): number { return (line.end.x - line.start.x); };
export function DeltaY(line : Types.T_Line  ): number { return (line.end.y - line.start.y); };
export function DeltaZ(line : Types.T_Line3D): number { return (line.end.z - line.start.z); };

export function GetLinePointsCoord(line : Types.T_Line2D): Coord.Types.T_Coord2D[] { return (Bresenham.Utils.BresenhamLinePoints(line)); };
