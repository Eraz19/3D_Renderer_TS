import * as Types from "./types";


const basesSize:number = 100;

export const coordinateSystemBases_3D:Types.T_CoordinateBases_3D =
[
	{ coord: [[0,0,0], [basesSize,         0,         0]], color: { red: 255, green:   0, blue:   0 } },
	{ coord: [[0,0,0], [        0, basesSize,         0]], color: { red:   0, green: 255, blue:   0 } },
	{ coord: [[0,0,0], [        0,         0, basesSize]], color: { red:   0, green:   0, blue: 255 } },
];

export const DEFAULT_EVENT_METRICS:Types.T_EventsResult =
{
	zoom      : 1,
	xRotation : 0,
	yRotation : 0,
	zRotation : 0,
	projection: "xy",
};
