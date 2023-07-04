import React from "react";


export type T_Args = { };

export const Hook = (args:T_Args):React.RefObject<HTMLCanvasElement> =>
{
	const canvasRef = React.useRef<HTMLCanvasElement>(null);

	React.useEffect(() =>
	{
		AddEvents();

		ResizeCanvas();
		
		return (CleanEvents);
	}, []);


	function AddEvents():void
	{
		window.addEventListener("resize", ResizeCanvas);
	};

	function CleanEvents():void
	{
		window.removeEventListener("resize", ResizeCanvas);
	};

	function ResizeCanvas():void
	{
		if (canvasRef.current)
		{
			const canvasContext:CanvasRenderingContext2D|null = canvasRef.current.getContext("2d");

			if (canvasContext)
			{
				canvasContext.canvas.width  = canvasContext.canvas.clientWidth;
				canvasContext.canvas.height = canvasContext.canvas.clientHeight;
			}
		}
	};

	return (canvasRef);
};
