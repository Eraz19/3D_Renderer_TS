import * as Coord from "../../../Utils/Coord";


export type T_PolarCoordSystem =
{
	radius : number;
	theta  : number;
	phi    : number;
}

export type T_PolarCamera =
{
	anchor     : Coord.Types.T_Coord3D;
	polarCoord : T_PolarCoordSystem;
};
