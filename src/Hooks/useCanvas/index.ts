import React from "react";


export type T_Args<T> =
{
	drawFrame:(context:CanvasRenderingContext2D, content:T) => void;
	content:React.MutableRefObject<T>;
};

export const Hook = <T extends unknown>(args:T_Args<T>):React.RefObject<HTMLCanvasElement> =>
{
	//const frameRenderingId:React.MutableRefObject<number|null> = React.useRef(null);

	const canvasRef = React.useRef<HTMLCanvasElement>(null);

	React.useEffect(() =>
	{
		if (canvasRef.current == null) return;

		canvasRef.current.width  = canvasRef.current.clientWidth;
		canvasRef.current.height = canvasRef.current.clientHeight;

		let canvasContext:CanvasRenderingContext2D|null = canvasRef.current.getContext("2d");

		//if (canvasContext == null) return; // Error handling -> Could not get canvas context

		//AddEvents(canvasContext);
		//FrameRendering(canvasContext);
		
		//return (():void => { UnmountCallback(canvasContext); });
	}, [/*args.drawFrame*/]);

	/*function UnmountCallback(canvasContext:CanvasRenderingContext2D|null):void
	{
		if (canvasContext != null)
		{
			CleanEvents(canvasContext);
			CleanFrameRendering();
		}
	};*/

	/*function AddEvents(canvasContext:CanvasRenderingContext2D):void
	{
		window.addEventListener("resize", ():void => { ResizeCanvas(canvasContext); });
	};

	function CleanEvents(canvasContext:CanvasRenderingContext2D):void
	{
		window.removeEventListener("resize", ():void => { ResizeCanvas(canvasContext); });
	};*/

	/*function ResizeCanvas(canvasContext:CanvasRenderingContext2D):void
	{
		canvasContext.canvas.width  = canvasContext.canvas.clientWidth;
		canvasContext.canvas.height = canvasContext.canvas.clientHeight;

		CleanFrameRendering();
		FrameRendering(canvasContext);
	};*/

	/*function CleanFrameRendering():void
	{
		if (frameRenderingId.current != null)
			window.cancelAnimationFrame(frameRenderingId.current);
	};*/

	/*function FrameRendering(context:CanvasRenderingContext2D):void
	{
		args.drawFrame(context, args.content.current, args.option?.current);

		if (args.isRefreshing)
			frameRenderingId.current = window.requestAnimationFrame((time:number):void => { FrameRendering(context); });
	};*/

	return (canvasRef);
};
