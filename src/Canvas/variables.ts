import * as Color from "eraz-lib/build/Graphic/Color";
import * as Line  from "eraz-lib/build/Graphic/Line";

import * as Types from "./types";


export const orthogonalBasis:{ line:Line.Types.T_Line3D; color:Color.RGB.Types.T_Color }[] =
[
	{ line: [[0,0,0], [1,0,0]], color: { red: 255, green:   0, blue:   0 } },
	{ line: [[0,0,0], [0,1,0]], color: { red:   0, green: 255, blue:   0 } },
	{ line: [[0,0,0], [0,0,1]], color: { red:   0, green:   0, blue: 255 } },
];

export const DEFAULT_EVENT_METRICS:Types.T_EventsResult =
{
	zoom      : 50,
	xRotation : 0,
	yRotation : 0,
	zRotation : 0,
	projection: "xy",
};
