import React          from "react";

import * as Color     from "eraz-lib/build/Graphic/Color";
import * as Point     from "eraz-lib/build/Graphic/Point";
import * as Polygone  from "eraz-lib/build/Graphic/Polygone";

import * as Hooks     from "../Hooks";
import * as Utils     from "./utils";
import * as Types     from "./types";
import * as Variables from "./variables";

import Style          from "./style.module.scss";


export function ClearFrame(context:CanvasRenderingContext2D, color:Color.Types.T_Color):void
{
	context.fillStyle = Color.Utils.ToString(color);
	context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
};



function DrawOnCanvas(points:Point.Types.T_ArrayLike2D[], context:CanvasRenderingContext2D):void
{
	let imagedata:ImageData = context.createImageData(context.canvas.width, context.canvas.height);

	points.map((point:Point.Types.T_ArrayLike):Point.Types.T_ArrayLike =>
	{
		return (Utils.FromCameraSpace_ToCanvas(point, context.canvas.width, context.canvas.height));
	})
	.forEach((point:Point.Types.T_ArrayLike):void => 
	{
		Utils.FillPixelBuffer(imagedata.data, context, point, { red: 0, green: 0, blue: 0 });
	});

	context.putImageData(imagedata, 0, 0);
};

export function RenderFrame(context:CanvasRenderingContext2D, polygones:Polygone.Types.T_Polygone3D[], option?:Types.T_EventsResult):void
{
	let eventsResult:Types.T_EventsResult = (option) ? option : {...Variables.DEFAULT_EVENT_METRICS};       
	let cameraProjectionMatrix;

	if      (eventsResult.projection === "xy") cameraProjectionMatrix = Utils.GenerateProjectionMatrixXY();
	else if (eventsResult.projection === "yz") cameraProjectionMatrix = Utils.GenerateProjectionMatrixYZ();
	else if (eventsResult.projection === "xz") cameraProjectionMatrix = Utils.GenerateProjectionMatrixXZ();
	else                                       return (eventsResult.projection);

	DrawOnCanvas(
		Utils.ProjectWorldView_ToCameraView(
			cameraProjectionMatrix,
			Utils.MoveCamera(
				polygones,
				eventsResult.zoom,
				Utils.GenerateRotationMatrix(eventsResult.xRotation, eventsResult.yRotation, eventsResult.zRotation)
			),
		)
		.map((polygone:Polygone.Types.T_Polygone2D):Point.Types.T_ArrayLike2D[]         => { return (Polygone.Utils.GetPolygonePoints(polygone)); })
		.reduce((prev:Point.Types.T_ArrayLike2D[], current:Point.Types.T_ArrayLike2D[]) => { return ([...prev, ...current]); }, []),
		context
	);
};


export const Component = ():JSX.Element =>
{
	const modelMesh = React.useRef<Polygone.Types.T_Polygone3D[]>([]);
	const eventMetrics = React.useRef<Types.T_EventsResult>({ ...Variables.DEFAULT_EVENT_METRICS });

	const canvasRef:React.RefObject<HTMLCanvasElement> = Hooks.useCanvas.Hook(
		{
			drawFrame   : RenderFrame,
			isRefreshing: false,
			content     : modelMesh,
			option      : eventMetrics,
		}
	);

	React.useEffect(() =>
	{
		AddEvents(canvasRef);

		return (() => { RemoveEvents(canvasRef); });
	}, []);


	function ReadOBJFile(file:File):void
	{
		const fileReader:FileReader = new FileReader();

		fileReader.readAsText(file);
		fileReader.onload = () =>
		{
			const fileContent:string|ArrayBuffer|null = fileReader.result;

			if (typeof fileContent === "string")
				modelMesh.current = Utils.ParseOBJFile(fileContent);
		};	
	};

	function AddEvents(elemRef:React.RefObject<HTMLCanvasElement>):void
	{
		if (elemRef.current)
		{
			elemRef.current.addEventListener("wheel"  , OnScroll );
			document       .addEventListener("keydown", OnKeydown);
		}
	};

	function RemoveEvents(elemRef:React.RefObject<HTMLCanvasElement>):void
	{
		if (elemRef.current)
		{
			elemRef.current.removeEventListener("wheel"  , OnScroll );
			document       .removeEventListener("keydown", OnKeydown);
		}
	};

	function OnScroll(e:WheelEvent):void
	{
		const zoomSteps:number = 2;

		e.preventDefault();

		if (e.deltaY < 0)
		{
			if (eventMetrics.current.zoom >= 10)
				eventMetrics.current.zoom -= zoomSteps;
		}
		else
			eventMetrics.current.zoom += zoomSteps; 
	};

	function OnKeydown(e:KeyboardEvent):void
	{
		function ProjectOnXY():void { eventMetrics.current.projection = "xy"; };
		function ProjectOnXZ():void { eventMetrics.current.projection = "xz"; };
		function ProjectOnYZ():void { eventMetrics.current.projection = "yz"; };

		if      (e.key === 'a') ProjectOnXY();
		else if (e.key === 'b') ProjectOnXZ();
		else if (e.key === 'c') ProjectOnYZ();
	};

	return (
		<>
			<canvas
				ref      ={canvasRef}
				className={Style.canvasContainer}
			/>
			<input
				className={Style.ReadFileButton}
				type     ={"file"}
				accept   ={".obj"}
				onChange ={(e:React.ChangeEvent<HTMLInputElement>) =>
				{
					if (e.target.files)
						ReadOBJFile(e.target.files[0]);
				}}
			/>
		</>
	);
};
