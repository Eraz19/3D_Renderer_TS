import React          from "react";

import * as Polygone  from "eraz-lib/build/Graphic/Polygone";

import * as Parser      from "../Parser";
import * as Hooks       from "../Hooks";
import * as PolarCamera from "../Pipeline/PolarCamera";
import * as Utils       from "./utils";
import * as Types       from "./types";
import * as Variables   from "./variables";

import Style          from "./style.module.scss";


export const Component = ():JSX.Element =>
{
	const canvasRef:React.RefObject<HTMLCanvasElement> = Hooks.useCanvas.Hook({});

	const [refresh, setRefresh] = React.useState<number>(0);
	const [debug  ,   setDebug] = React.useState<Types.T_CoordinateBases_3D>();

	const modelMesh = React.useRef<Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[]>([]);
	const camera    = React.useRef<PolarCamera.Types.T_Camera>(
		{
			anchor     : [0,0,0],
			polarCoord : [1,0,0],
			eventTarger: "anchor",
		}
	);

	React.useEffect(() =>
	{
		AddEvents(canvasRef);

		setDebug(Utils.RenderFrame(canvasRef, [...Variables.coordinateSystemBases_3D], modelMesh.current, camera.current));

		return (() => { RemoveEvents(canvasRef); });
	}, []);

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

	function ReadOBJFile(file:File):void
	{
		const fileReader:FileReader = new FileReader();

		fileReader.readAsText(file);
		fileReader.onload = () =>
		{
			const fileContent:string|ArrayBuffer|null = fileReader.result;

			if (typeof fileContent === "string")
			{
				modelMesh.current = Parser.OBJ.ParseOBJFile(fileContent)
					.map((polygone:Polygone.Types.T_Polygone3D):Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D> =>
					{
						return ({ color: { red: 0, green: 0, blue: 0 }, coord: polygone });
					});

				setDebug(Utils.RenderFrame(canvasRef, [...Variables.coordinateSystemBases_3D], modelMesh.current, camera.current));
			}
		};	
	};

	function OnScroll(e:WheelEvent):void
	{
		function ModifyCameraRaduis(step:.1|-.1):void
		{
			const newRadius:number = camera.current.polarCoord[0] + step

			if (newRadius > 0)
				camera.current.polarCoord[0] = newRadius;
		};

		if (camera.current.eventTarger === "camera")
		{
			if (e.deltaY < 0)
			{
				if (camera.current.polarCoord[0] >= Variables.DEFAULT_EVENT_METRICS.zoom)
					ModifyCameraRaduis(-.1);
			}
			else
				ModifyCameraRaduis(.1);

			setDebug(Utils.RenderFrame(canvasRef, [...Variables.coordinateSystemBases_3D], modelMesh.current, camera.current));
		}

		setRefresh((prev) => { return (prev + 1) });
	};

	function OnKeydown(e:KeyboardEvent):void
	{
		function ModifyCameraAngle(step:1|-1, angle:"theta"|"phi"):void
		{
			function ModifyThetaAngle():void { camera.current.polarCoord[1] = ((camera.current.polarCoord[1] + step % 360) + 360) % 360; };
			function ModifyPhiAngle():void
			{
				const newPhiAngle = camera.current.polarCoord[2] + step;

				if (newPhiAngle < 89 && newPhiAngle > -89)
					camera.current.polarCoord[2] = newPhiAngle;
			};

			if      (angle === "theta") ModifyThetaAngle();
			else if (angle === "phi")   ModifyPhiAngle();
		};

		function ModifyAnchor(step:1|-1, axis:"x"|"y"|"z"):void
		{
			if      (axis === "x") camera.current.anchor[0] += step;
			else if (axis === "y") camera.current.anchor[1] += step;
			else if (axis === "z") camera.current.anchor[2] += step;
		};

		function MoveRight():void
		{
			if      (camera.current.eventTarger === "camera") ModifyCameraAngle(1, "theta");
			else if (camera.current.eventTarger === "anchor") ModifyAnchor(1, "y");

			setDebug(Utils.RenderFrame(canvasRef, [...Variables.coordinateSystemBases_3D], modelMesh.current, camera.current));
		};

		function MoveLeft():void
		{
			if      (camera.current.eventTarger === "camera") ModifyCameraAngle(-1, "theta");
			else if (camera.current.eventTarger === "anchor") ModifyAnchor(-1, "y");

			setDebug(Utils.RenderFrame(canvasRef, [...Variables.coordinateSystemBases_3D], modelMesh.current, camera.current));
		};

		function MoveUp(e:KeyboardEvent):void
		{
			if      (camera.current.eventTarger === "camera") ModifyCameraAngle(1, "phi");
			else if (camera.current.eventTarger === "anchor")
			{
				if (e.ctrlKey) ModifyAnchor(1, "x");
				else           ModifyAnchor(1, "z");
			}

			setDebug(Utils.RenderFrame(canvasRef, [...Variables.coordinateSystemBases_3D], modelMesh.current, camera.current));
		};

		function MoveDown(e:KeyboardEvent):void
		{
			if      (camera.current.eventTarger === "camera") ModifyCameraAngle(-1, "phi");
			else if (camera.current.eventTarger === "anchor")
			{
				if (e.ctrlKey) ModifyAnchor(-1, "x");
				else           ModifyAnchor(-1, "z");
			}

			setDebug(Utils.RenderFrame(canvasRef, [...Variables.coordinateSystemBases_3D], modelMesh.current, camera.current));
		};

		if      (e.key === 'a'         ) camera.current.eventTarger = "anchor";
		else if (e.key === 'c'         ) camera.current.eventTarger = "camera";
		else if (e.key === "ArrowRight") MoveRight     ();
		else if (e.key === "ArrowLeft" ) MoveLeft      ();
		else if (e.key === "ArrowUp"   ) MoveUp        (e);
		else if (e.key === "ArrowDown" ) MoveDown      (e);

		setRefresh((prev) => { return (prev + 1) });
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
			<div className={Style.EventTarget}>{camera.current.eventTarger}</div>
			<table className={Style.CameraTable}>
				<tbody>
					<tr><th>Anchor</th></tr>
					<tr><td>x</td><td>{camera.current.anchor[0]}</td></tr>
					<tr><td>y</td><td>{camera.current.anchor[1]}</td></tr>
					<tr><td>z</td><td>{camera.current.anchor[2]}</td></tr>
					<tr><th>Camera</th></tr>
					<tr><td>Raduis</td><td>{camera.current.polarCoord[0].toFixed(2)}</td></tr>
					<tr><td>&theta;</td><td>{camera.current.polarCoord[1].toFixed(2)}</td></tr>
					<tr><td>&phi;</td><td>{camera.current.polarCoord[2].toFixed(2)}</td></tr>
				</tbody>
			</table>
			{/*(debug) ? <Debug.Component bases={debug} /> : null*/}
		</>
	);
};
