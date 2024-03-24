import * as Vector from "../Vector";


export function DeltaX(vertex1X : number, vertex2X : number) : number { return (vertex2X - vertex1X); };
export function DeltaY(vertex1Y : number, vertex2Y : number) : number { return (vertex2Y - vertex1Y); };

function HorizontalLinePoints(
	vertex1X : number,
	vertex1Y : number,
	vertex2X : number,
	vertex2Y : number,
): Vector.Types.T_Vec2D[]
{
	let startVertexX : number                 = vertex1X;
	let startVertexY : number                 = vertex1Y;
	let endVertexX   : number                 = vertex2X;
	let result       : Vector.Types.T_Vec2D[] = [];

	if (vertex1X > vertex2X)
	{
		startVertexX = vertex2X;
		startVertexY = vertex2Y;
		endVertexX   = vertex1X;
	}

	for (let pixelX : number = startVertexX; pixelX <= endVertexX; ++pixelX)
		result = [...result, [pixelX,startVertexY]];

	return (result);
};

function VerticalLinePoints(
	vertex1X : number,
	vertex1Y : number,
	vertex2X : number,
	vertex2Y : number,
): Vector.Types.T_Vec2D[]
{
	let startVertexX : number                 = vertex1X;
	let startVertexY : number                 = vertex1Y;
	let endVertexY   : number                 = vertex2Y;
	let result       : Vector.Types.T_Vec2D[] = [];

	if (vertex1Y > vertex2Y)
	{
		startVertexX = vertex2X;
		startVertexY = vertex2Y;
		endVertexY   = vertex1Y;
	}

	for (let pixelY : number = startVertexY; pixelY <= endVertexY; ++pixelY)
		result = [...result, [startVertexX,pixelY]];

	return (result);
};

function HorizontalDiagonalPoints(
	vertex1X : number,
	vertex1Y : number,
	vertex2X : number,
	vertex2Y : number,
	deltaX   : number,
	deltaY   : number,
): Vector.Types.T_Vec2D[]
{
	let startVertexX          : number                 = vertex1X;
	let endVertexX            : number                 = vertex2X;
	let floatErrorAccumulator : number                 = -.5;
	let pixelY                : number                 = vertex1Y;
	let result                : Vector.Types.T_Vec2D[] = [];

	const yForEachXIteration : number = deltaY / deltaX;
	const yIterator          : number = (yForEachXIteration >= 0) ? 1 : -1;

	if (vertex1X > vertex2X)
	{
		startVertexX = vertex2X;
		endVertexX   = vertex1X;
		pixelY       = vertex2Y;
	}

	for (let pixelX : number = startVertexX; pixelX <= endVertexX; ++pixelX)
	{
		result = [...result, [pixelX,pixelY]];
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
	vertex1X : number,
	vertex1Y : number,
	vertex2X : number,
	vertex2Y : number,
	deltaX   : number,
	deltaY   : number,
): Vector.Types.T_Vec2D[]
{	
	let startVertexY          : number                 = vertex1Y;
	let endVertexY            : number                 = vertex2Y;
	let floatErrorAccumulator : number                 = -.5;
	let pixelX                : number                 = vertex1X;
	let result                : Vector.Types.T_Vec2D[] = [];

	const xForEachYIteration : number = deltaX / deltaY;
	const xIterator          : number = (xForEachYIteration >= 0) ? 1 : -1;

	if (vertex1Y > vertex2Y)
	{
		startVertexY = vertex2Y;
		endVertexY   = vertex1Y;
		pixelX       = vertex2X;
	}

	for (let pixelY : number = startVertexY; pixelY <= endVertexY; ++pixelY)
	{
		result = [...result, [pixelX,pixelY]];
		floatErrorAccumulator += Math.abs(xForEachYIteration);

		if (floatErrorAccumulator >= 0)
		{
			pixelX += xIterator;
			--floatErrorAccumulator;
		}
	}

	return (result);
};

export function BresenhamLinePoints(
	vertex1X : number,
	vertex1Y : number,
	vertex2X : number,
	vertex2Y : number,
): Vector.Types.T_Vec2D[]
{
	const deltaX : number = DeltaX(vertex1X, vertex2X);
	const deltaY : number = DeltaY(vertex1Y, vertex2Y);

	if      (deltaX === 0)                         return (VerticalLinePoints      (vertex1X, vertex1Y, vertex2X, vertex2Y                ));
	else if (deltaY === 0)                         return (HorizontalLinePoints    (vertex1X, vertex1Y, vertex2X, vertex2Y                ));
	else if (Math.abs(deltaX) >= Math.abs(deltaY)) return (HorizontalDiagonalPoints(vertex1X, vertex1Y, vertex2X, vertex2Y, deltaX, deltaY));
	else                                           return (VerticalDiagonalPoints  (vertex1X, vertex1Y, vertex2X, vertex2Y, deltaX, deltaY));
};