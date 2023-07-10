import * as Line  from "../Shapes/Line";
import * as Coord from "../Coord";


function HorizontalLinePoints(line : Line.Types.T_Line2D): Coord.Types.T_Coord2D[]
{
	const orderedLinePoints : Line.Types.T_Line2D = (line.start.x < line.end.x) ? line : { start: line.end, end: line.start };
	const pixelY            : number              = orderedLinePoints.start.y;

	let result : Coord.Types.T_Coord2D[] = [];

	for (let pixelX : number = orderedLinePoints.start.x; pixelX <= orderedLinePoints.end.x; ++pixelX)
		result = [...result, { x: pixelX, y: pixelY }];

	return (result);
};

function VerticalLinePoints(line : Line.Types.T_Line2D): Coord.Types.T_Coord2D[]
{
	const orderedLinePoints : Line.Types.T_Line2D = (line.start.y < line.end.y) ? line : { start: line.end, end: line.start };
	const pixelX            : number              = orderedLinePoints.start.x;

	let result : Coord.Types.T_Coord2D[] = [];

	for (let pixelY : number = orderedLinePoints.start.y; pixelY <= orderedLinePoints.end.y; ++pixelY)
		result = [...result, { x: pixelX, y: pixelY }];

	return (result);
};

function HorizontalDiagonalPoints(
	line   : Line.Types.T_Line2D,
	deltaX : number,
	deltaY : number,
): Coord.Types.T_Coord2D[]
{
	const yForEachXIteration : number              = deltaY / deltaX;
	const yIterator          : number              = (yForEachXIteration >= 0) ? 1 : -1;
	const orderedLinePoints  : Line.Types.T_Line2D = (line.start.x < line.end.x) ? line : { start: line.end, end: line.start };

	let floatErrorAccumulator : number                  = -.5;
	let pixelY                : number                  = orderedLinePoints.start.y;
	let result                : Coord.Types.T_Coord2D[] = [];

	for (let pixelX : number = orderedLinePoints.start.x; pixelX <= orderedLinePoints.end.x; ++pixelX)
	{
		result = [...result, { x: pixelX, y: pixelY }];
		floatErrorAccumulator += Math.abs(yForEachXIteration);

		if (floatErrorAccumulator >= 0)
		{
			pixelY += yIterator;
			--floatErrorAccumulator;
		}
	}

	return (result);
};

function VerticalDiagonalPoints(
	line   : Line.Types.T_Line2D,
	deltaX : number,
	deltaY : number,
): Coord.Types.T_Coord2D[]
{
	const xForEachYIteration : number              = deltaX / deltaY;
	const xIterator          : number              = (xForEachYIteration >= 0) ? 1 : -1;
	const orderedLinePoints  : Line.Types.T_Line2D = (line.start.y < line.end.y) ? line : { start: line.end, end: line.start };

	let floatErrorAccumulator : number                  = -.5;
	let pixelX                : number                  = orderedLinePoints.start.x;
	let result                : Coord.Types.T_Coord2D[] = [];

	for (let pixelY : number = orderedLinePoints.start.y; pixelY <= orderedLinePoints.end.y; ++pixelY)
	{
		result = [...result, { x: pixelX, y: pixelY }];
		floatErrorAccumulator += Math.abs(xForEachYIteration);

		if (floatErrorAccumulator >= 0)
		{
			pixelX += xIterator;
			--floatErrorAccumulator;
		}
	}

	return (result);
};

export function BresenhamLinePoints(line : Line.Types.T_Line2D): Coord.Types.T_Coord2D[]
{
	const deltaX : number = Line.Utils.DeltaX(line);
	const deltaY : number = Line.Utils.DeltaY(line);

	if      (deltaX === 0)                         return (VerticalLinePoints      (line                ));
	else if (deltaY === 0)                         return (HorizontalLinePoints    (line                ));
	else if (Math.abs(deltaX) >= Math.abs(deltaY)) return (HorizontalDiagonalPoints(line, deltaX, deltaY));
	else                                           return (VerticalDiagonalPoints  (line, deltaX, deltaY));
};