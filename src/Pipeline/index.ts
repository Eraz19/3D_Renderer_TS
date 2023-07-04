import * as Polygone    from "eraz-lib/build/Graphic/Polygone";
import * as Point       from "eraz-lib/build/Graphic/Point";

import * as CanvasTypes from "../Canvas/types";
import * as Matrix      from "../Matrix";


export function DrawOnCanvas(
	points:CanvasTypes.T_ColoredPoint<Point.Types.T_Point2D>[],
	context:CanvasRenderingContext2D,
):void
{
	function FillPixelBuffer(
		buffer:Uint8ClampedArray,
		context:CanvasRenderingContext2D,
		point:CanvasTypes.T_ColoredPoint<Point.Types.T_Point2D>,
	):void
	{
		// We need to multiply by 4 the all surface because each pixel is encode on a RGBA palette
		const bufferIndex:number = (point.coord[0] + point.coord[1] * context.canvas.width) * 4;

		if (bufferIndex >= 0 && bufferIndex < buffer.length - 4)
		{
			buffer[bufferIndex + 0] = point.color.red;
			buffer[bufferIndex + 1] = point.color.green;
			buffer[bufferIndex + 2] = point.color.blue;
			buffer[bufferIndex + 3] = 255;
		}
	};

	const imagedata:ImageData = context.createImageData(context.canvas.width, context.canvas.height);
	const canvasWidth:number  = context.canvas.width;
	const canvasHeight:number = context.canvas.height;

	points.map((point:CanvasTypes.T_ColoredPoint<Point.Types.T_Point2D>):CanvasTypes.T_ColoredPoint<Point.Types.T_Point2D> =>
	{
		return (
			{
				coord: [Math.floor(point.coord[0] + canvasWidth * .5), Math.floor(-point.coord[1] + canvasHeight * .5)],
				color: point.color,
			}
		);
	})
	.forEach((point:CanvasTypes.T_ColoredPoint<Point.Types.T_Point2D>):void =>
	{
		FillPixelBuffer(imagedata.data, context, point);
	});

	context.putImageData(imagedata, 0, 0);
};
