import * as Types from "./types";


const basesSize : number = 100;

export const coordinateSystemBases3D : Types.T_CoordinateBases3D =
{
	vertices :
	[
		[0        ,0        ,0        ],
		[basesSize,0        ,0        ],
		[0        ,basesSize,0        ],
		[0        ,0        ,basesSize],
	],
	edges:
	[
		{ edge: [0,1], color: { red: 255, green:   0, blue:   0 } },
		{ edge: [0,2], color: { red:   0, green: 255, blue:   0 } },
		{ edge: [0,3], color: { red:   0, green:   0, blue: 255 } },
	]
};
