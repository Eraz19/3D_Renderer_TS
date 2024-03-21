import React from "react";


import * as PolarCamera from "../../../Utils/Rasterizer/PolarCamera";
import * as Coord       from "../../../Utils/Coord";

import * as RasterizerDisplay from "../index";

import * as Utils from "./utils";
import * as Types from "./types";
import      Style from "./style.module.scss";

export function Component() : JSX.Element
{
	const sleepTimeout = React.useRef<NodeJS.Timeout>();

	const context = React.useContext(RasterizerDisplay.RasterizerContext);

	React.useEffect(() =>
	{
		const observer = new ResizeObserver(HandleResizeResize);

		function AddEvents(elemRef : HTMLCanvasElement | undefined) : void
		{
			if (elemRef)
				observer.observe(elemRef);
		};
		
		function RemoveEvents() : void
		{
			observer.disconnect();
		};
		
		AddEvents(context.canvas);
		context.rerenderFrame = Utils.RedrawFrame;
		//RenderLoop();
		
		return (() => { RemoveEvents(); });
	}, []);

	function IsCameraIsSame(
		prevCamera ?: PolarCamera.Types.T_PolarCamera,
		newCamera  ?: PolarCamera.Types.T_PolarCamera,
	) : boolean
	{
		if (prevCamera && newCamera)
		{
			const cameraAnchorIsSame     : boolean = Coord      .Utils.IsEqual(prevCamera.anchor    , newCamera.anchor    );
			const cameraPolarCoordIsSame : boolean = PolarCamera.Utils.IsEqual(prevCamera.polarCoord, newCamera.polarCoord);
	
			return (cameraAnchorIsSame && cameraPolarCoordIsSame);
		}
		else
			return (false);
	};

	function IsCanvasSizeIsSame(
		prevCanvasSize ?: Types.T_CanvasSize,
		newCanvasSier  ?: Types.T_CanvasSize,
	) : boolean
	{
		if (prevCanvasSize && newCanvasSier) return (prevCanvasSize.width === newCanvasSier.width && prevCanvasSize.height === newCanvasSier.height);
		else                                 return (false);
	};

	async function RenderLoop() : Promise<void>
	{
		let renderTime              : Types.T_Second;
		let remainingSecondsInFrame : Types.T_Second;

		function Sleep(millisecond : number) : Promise<void>
		{
			clearTimeout(sleepTimeout.current);

			return (new Promise((resolve) => { sleepTimeout.current = setTimeout(resolve, millisecond); }));
		};

		if (context.renderLoop)
		{
			for (let i : number = 0; i < 20; ++i)
			{
				context.renderLoop.renderStart = new Date();
	
				if (context.camera && context.canvas)
				{
					console.log("IsCameraIsSame: ", IsCameraIsSame    (context.renderLoop?.cameraSnapShot    , { anchor: context.camera.anchor     , polarCoord: context.camera.polarCoord  }));
					console.log("IsCanvasSizeIsSame: ", IsCanvasSizeIsSame(context.renderLoop?.canvasSizeSnapShot, { width : context.canvas.clientWidth, height    : context.canvas.clientHeight}));
				}

				if
				(
					context.camera &&
					context.canvas &&
					!IsCameraIsSame    (context.renderLoop?.cameraSnapShot    , { anchor: context.camera.anchor     , polarCoord: context.camera.polarCoord  }) //&&
					//!IsCanvasSizeIsSame(context.renderLoop?.canvasSizeSnapShot, { width : context.canvas.clientWidth, height    : context.canvas.clientHeight})
				)
				{
					console.log("in");

					context.renderLoop.cameraSnapShot     =	PolarCamera.Utils.DeepCopy({ anchor: context.camera.anchor, polarCoord: context.camera.polarCoord });
					//context.renderLoop.canvasSizeSnapShot = { width: context.canvas.clientWidth, height: context.canvas.clientHeight};

					if (context.camera)
						Utils.RedrawFrame(context.canvas, context.camera, context.coordinateSystemBases_3D, context.modelMesh, context.background);
				}

				context.renderLoop.renderEnd = new Date();
				renderTime                   = Math.abs((context.renderLoop.renderEnd.getTime() - context.renderLoop.renderStart.getTime()) / 1000);
				remainingSecondsInFrame      = context.renderLoop.frameTime - renderTime;

				await Sleep(remainingSecondsInFrame * 1000);
			};
		}
	};

	function BindCanvasInContext(ref : HTMLCanvasElement | null)
	{
		context.canvas = ref ?? undefined;
	};

	function HandleResizeResize() : void
	{
		if (context.canvas)
		{
			context.canvas.width  = context.canvas.clientWidth;
			context.canvas.height = context.canvas.clientHeight;

			if (context.camera)
				Utils.RedrawFrame(context.canvas, context.camera, context.coordinateSystemBases_3D, context.modelMesh, context.background);
		}
	};

	return (
		<canvas
			ref       = {BindCanvasInContext}
			className = {Style.Container}
		/>
	);
};

export * as Utils     from "./utils";
export * as Types     from "./types";
export * as Variables from "./variables";




