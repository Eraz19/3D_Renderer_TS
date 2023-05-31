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
	const zoom:number = (option?.zoom) ? option.zoom : 50;

	const cameraProjectionMatrix:Types.T_Matrix_2_3        = Utils.GenerateProjectionMatrixXY(zoom);
	const projectedPolygones:Polygone.Types.T_Polygone2D[] = Utils.ProjectWorldView_ToCameraView(cameraProjectionMatrix, polygones);

	DrawOnCanvas(
		projectedPolygones
		.map((polygone:Polygone.Types.T_Polygone2D):Point.Types.T_ArrayLike2D[]         => { return (Polygone.Utils.GetPolygonePoints(polygone)); })
		.reduce((prev:Point.Types.T_ArrayLike2D[], current:Point.Types.T_ArrayLike2D[]) => { return ([...prev, ...current]); }, []),
		context
	);
};


export const Component = ():JSX.Element =>
{
	const modelMesh = React.useRef<Polygone.Types.T_Polygone3D[]>([]);
	const eventMetrics = React.useRef<Types.T_EventsResult>({ ...Variables.eventMetrics });

	const canvasRef:React.RefObject<HTMLCanvasElement> = Hooks.useCanvas.Hook(
		{
			drawFrame   : RenderFrame,
			isRefreshing: true,
			content     : modelMesh,
			option      : eventMetrics,
		}
	);

	React.useEffect(() =>
	{
		if (canvasRef.current)
		{
			canvasRef.current.addEventListener("wheel", OnScroll);
		}

		return (() =>
		{
			canvasRef.current?.removeEventListener("wheel", OnScroll);
		})
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

	function OnScroll(e:WheelEvent):void { eventMetrics.current.zoom += e.clientY; };

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
