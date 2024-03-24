import React from "react";


import * as PolarCamera from "../../../Utils/Rasterizer/PolarCamera";
import * as Coord       from "../../../Utils/Coord";

import * as RasterizerDisplay from "../index";

import * as Utils from "./utils";
import * as Types from "./types";
import      Style from "./style.module.scss";


export function Component() : JSX.Element
{
	const sleepTimeout     = React.useRef<NodeJS.Timeout>();
	const fpsDebugInterval = React.useRef<NodeJS.Timer>();

	const context = React.useContext(RasterizerDisplay.RasterizerContext);

	React.useEffect(() =>
	{
		const observer = new ResizeObserver(HandleResize);

		function AddEvents(elemRef : HTMLCanvasElement | undefined) : void
		{
			if (elemRef)
				observer.observe(elemRef);
		};
		
		function RemoveEvents() : void
		{
			observer.disconnect();
			clearTimeout(sleepTimeout.current);
			clearInterval(fpsDebugInterval.current)
		};
		
		AddEvents(context.canvasRef);
		RenderLoop();
		
		return (() => { RemoveEvents(); });
	}, []);

	async function RenderLoop() : Promise<void>
	{
		function Sleep(millisecond : number) : Promise<void>
		{
			clearTimeout(sleepTimeout.current);

			return (new Promise((resolve) => { sleepTimeout.current = setTimeout(resolve, millisecond); }));
		};

		function IsCameraSame(
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
	
		function IsCanvasSizeSame(
			prevCanvasSize ?: Types.T_CanvasSize,
			newCanvasSier  ?: Types.T_CanvasSize,
		) : boolean
		{
			if (prevCanvasSize && newCanvasSier) return (prevCanvasSize.width === newCanvasSier.width && prevCanvasSize.height === newCanvasSier.height);
			else                                 return (false);
		};

		function IsMeshSame(
			prevMesh ?: Types.T_ModelMesh<number>,
			newMesh  ?: Types.T_ModelMesh<number>,
		) : boolean
		{
			return (prevMesh === newMesh);
		};

		function ResizeCanvas(newSize : Types.T_CanvasSize) : void
		{
			if (context.canvasRef)
			{
				context.canvasRef.width  = newSize.width; 
				context.canvasRef.height = newSize.height;
			}
		};

		let renderTime              : Types.T_Second;
		let remainingSecondsInFrame : Types.T_Second;

		if (context.renderLoop)
		{
			while (true)
			{
				context.renderLoop.renderStart = new Date();

				if (context.camera && context.canvasRef && context.canvasSize)
				{
					const isRerenderingBecauseOfCameraUpdate     : boolean = !IsCameraSame    (context.renderLoop?.cameraSnapShot    , { ...context.camera     });
					const isRerenderingBecauseOfCanvasSizeUpdate : boolean = !IsCanvasSizeSame(context.renderLoop?.canvasSizeSnapShot, { ...context.canvasSize });
					const isRerenderingBecauseOfMeshUpdate       : boolean = !IsMeshSame      (context.renderLoop?.meshSnapShot      , context.modelMesh        );

					if (isRerenderingBecauseOfCameraUpdate) context.renderLoop.cameraSnapShot =	PolarCamera.Utils.DeepCopy(context.camera);
					if (isRerenderingBecauseOfMeshUpdate  ) context.renderLoop.meshSnapShot   =	context.modelMesh;
					if (isRerenderingBecauseOfCanvasSizeUpdate)
					{
						context.renderLoop.canvasSizeSnapShot = { ...context.canvasSize };
						ResizeCanvas(context.canvasSize);
					}
					
					if (context.camera && (isRerenderingBecauseOfCameraUpdate || isRerenderingBecauseOfCanvasSizeUpdate || isRerenderingBecauseOfMeshUpdate))
						Utils.RenderFrame(context.canvasRef, context.camera, context.coordinateSystemBases, context.modelMesh, context.background);
				}

				context.renderLoop.renderEnd = new Date();
				renderTime                   = Math.abs((context.renderLoop.renderEnd.getTime() - context.renderLoop.renderStart.getTime()) / 1000);
				remainingSecondsInFrame      = context.renderLoop.frameTime - renderTime;

				await Sleep(remainingSecondsInFrame * 1000);
				context.renderLoop.frameCount += 1;
			};
		}
	};

	function BindCanvasInContext(ref : HTMLCanvasElement | null)
	{
		context.canvasRef = ref ?? undefined;
	};

	function HandleResize() : void
	{
		if (context.canvasRef)
			context.canvasSize = { width: context.canvasRef.clientWidth, height: context.canvasRef.clientHeight };
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
