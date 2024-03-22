import * as Line   from "../Shapes/Line";
import * as Coord  from "../Coord";
import * as Matrix from "../Matrix";


function FromCoordWorld_ToCoordCamera(
	cameraMatrix : Matrix.Types.T_Matrix_4_4,
	coord        : Coord.Types.T_Coord3D,
) : Coord.Types.T_Coord3D
{
	return ({ ...Matrix.Utils.Transformation(cameraMatrix, { ...coord, w: 1 }) });
};

export function FromCameraSpace_ToDisplaySpace_Coord(
	coord        : Coord.Types.T_Coord3D,
	cameraRadius : number,
): Coord.Types.T_Coord3D
{
	return (Matrix.Utils.Transformation([[0,cameraRadius,0],[0,0,cameraRadius],[cameraRadius,0,0]], coord));
};

export function CenterDisplayOrigin(
	coord         : Coord.Types.T_Coord3D,
	displayWidth  : number,
	displayHeight : number,
):Coord.Types.T_Coord3D
{
	return ({ x: Math.floor(coord.x + displayWidth * .5), y: Math.floor(-coord.y + displayHeight * .5), z: coord.z });
};

export function FromWorldSpace_ToCameraSpace(
	cameraMatrix : Matrix.Types.T_Matrix_4_4,
	mesh         : Line.Types.T_ColoredLine<Line.Types.T_Line3D>[],
): Line.Types.T_ColoredLine<Line.Types.T_Line3D>[]
{
	return (
		mesh.map((line : Line.Types.T_ColoredLine<Line.Types.T_Line3D>): Line.Types.T_ColoredLine<Line.Types.T_Line3D> =>
		{
			return (
				{
					color: line.color,
					coord:
					{
						start: FromCoordWorld_ToCoordCamera(cameraMatrix, line.coord.start),
						end  : FromCoordWorld_ToCoordCamera(cameraMatrix, line.coord.end),
					}
				}
			);
		})
	);
};
