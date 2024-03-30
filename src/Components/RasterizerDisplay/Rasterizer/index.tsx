import * as React   from "react";
import * as ErazLib from "eraz-lib";


import * as RasterizerDisplay from "../index";

import * as Utils from "./utils";
import * as Types from "./types";
import      Style from "./style.module.scss";


export function Component() : JSX.Element
{
	React.useEffect(() =>
	{
		const coordinateSystemSizeRelativeToCanvasHeight : number = 0.3;

		if (context.canvasRef && context.camera)
		{
			context.coordinateSystemBases     = Utils.GenerateCoordinateBases3D(context.canvasRef.clientHeight * coordinateSystemSizeRelativeToCanvasHeight);
			context.meshToRender              = Utils.MergeMeshes([context.coordinateSystemBases, context.modelMesh]); 
			context.coordinateSystemBasesSize = context.canvasRef.clientHeight * coordinateSystemSizeRelativeToCanvasHeight;
			context.camera.anchor[2]          = context.canvasRef.clientHeight * (coordinateSystemSizeRelativeToCanvasHeight * 0.25);
			context.camera.initialAnchor[2]   = context.canvasRef.clientHeight * (coordinateSystemSizeRelativeToCanvasHeight * 0.25);
		}
	}, []);

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
			prevCamera ?: Types.T_PolarCamera,
			newCamera  ?: Types.T_PolarCamera,
		) : boolean
		{
			if (prevCamera && newCamera)
			{
				const cameraAnchorIsSame     : boolean = ErazLib.Graphic.Vector.Utils.IsEqual(prevCamera.anchor    , newCamera.anchor    );
				const cameraPolarCoordIsSame : boolean = ErazLib.Graphic.Vector.Utils.IsEqual(prevCamera.polarCoord, newCamera.polarCoord);
		
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

					if (isRerenderingBecauseOfCameraUpdate) context.renderLoop.cameraSnapShot =	Utils.PolarCameraDeepCopy(context.camera);
					if (isRerenderingBecauseOfMeshUpdate  ) context.renderLoop.meshSnapShot   =	context.modelMesh;
					if (isRerenderingBecauseOfCanvasSizeUpdate)
					{
						context.renderLoop.canvasSizeSnapShot = { ...context.canvasSize };
						ResizeCanvas(context.canvasSize);
					}
					
					if (context.camera && (isRerenderingBecauseOfCameraUpdate || isRerenderingBecauseOfCanvasSizeUpdate || isRerenderingBecauseOfMeshUpdate))
						Utils.RenderFrame(context.canvasRef, context.camera, context.meshToRender, context.background);
				}

				context.renderLoop.renderEnd = new Date();
				renderTime                   = Math.abs((context.renderLoop.renderEnd.getTime() - context.renderLoop.renderStart.getTime()) / 1000);
				remainingSecondsInFrame      = context.renderLoop.frameTime - renderTime;

				await Sleep(remainingSecondsInFrame * 1000);
				context.renderLoop.frameCount += 1;
			};
		}
	};

	function BindCanvasInContext(ref : HTMLCanvasElement | null) : void
	{
		context.canvasRef = ref ?? undefined;
	};

	function HandleResize() : void
	{
		if (context.canvasRef && context.camera)
		{
			context.canvasSize = { width: context.canvasRef.clientWidth, height: context.canvasRef.clientHeight };
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
