import * as Rasterizer from "../../Utils/Rasterizer";


const basesSize:number = 100;

export const coordinateSystemBases_3D:Rasterizer.Types.T_CoordinateBases_3D =
[
	{
		color: { red: 255, green:   0, blue:   0 },
		coord:
		{
			start: { x:         0, y: 0, z: 0 },
			end  : { x: basesSize, y: 0, z: 0 },
		},
	},
	{
		color: { red:   0, green: 255, blue:   0 },
		coord:
		{
			start: { x: 0, y:         0, z: 0 },
			end  : { x: 0, y: basesSize, z: 0 },
		},
	},
	{
		color: { red:   0, green:   0, blue: 255 },
		coord:
		{
			start: { x: 0, y: 0, z:         0 },
			end  : { x: 0, y: 0, z: basesSize },
		},
	},
];
