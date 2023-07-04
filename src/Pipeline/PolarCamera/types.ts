import * as Point  from "eraz-lib/build/Graphic/Point";


// For the polar coord the tuple contains information for [radius,latitude,longitude]
export type T_PolarCoordSystem     = Point.Types.T_Point3D;
export type T_CartesianCoordSystem = Point.Types.T_Point3D;

export type T_EventTarget = "camera"|"anchor";

export type T_Camera =
{
	anchor:Point.Types.T_Point3D;
	polarCoord:T_PolarCoordSystem;
	eventTarger:T_EventTarget;
};


