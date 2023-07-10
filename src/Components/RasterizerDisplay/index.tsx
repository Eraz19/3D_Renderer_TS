import React from "react";

import * as Polygone    from "../../Utils/Shapes/Polygone";
import * as Hooks       from "../../Hooks";
import * as PolarCamera from "./PolarCamera";
import * as Types       from "./types";
export * as Utils       from "./utils";
import      Style       from "./style.module.scss";


export const Component = (props : Types.T_Props): JSX.Element =>
{
	const canvasRef : React.RefObject<HTMLCanvasElement>                                                      = Hooks.useCanvas.Hook({});
	const model     : React.MutableRefObject<Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[]> = React.useRef([]);
	const camera    : React.MutableRefObject<PolarCamera.Types.T_PolarCamera>                                 = React.useRef(props.defaultCamera);

	React.useEffect(() => { model.current = props.model; }, [props.model]);

	React.useEffect(() =>
	{
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

		AddEvents(canvasRef);

		return (() => { RemoveEvents(canvasRef); });
	}, []); 

	function OnScroll(e:WheelEvent):void
	{
		function ModifyCameraRaduis(step:.1|-.1):void
		{
			const newRadius:number = camera.current.polarCoord.radius + step;

			if (newRadius > 0)
				camera.current.polarCoord.radius = newRadius;
		};

		if (camera.current.eventTarger === "camera")
		{
			if (e.deltaY < 0)
			{
				if (camera.current.polarCoord.radius >= 1)
					ModifyCameraRaduis(-.1);
			}
			else
				ModifyCameraRaduis(.1);
		}
	};

	function OnKeydown(e:KeyboardEvent):void
	{
		function ModifyCameraAngle(step:1|-1, angle:"theta"|"phi"):void
		{
			function ModifyThetaAngle():void
			{
				camera.current.polarCoord.theta = ((camera.current.polarCoord.theta + step % 360) + 360) % 360;
			};
			function ModifyPhiAngle():void
			{
				const newPhiAngle = camera.current.polarCoord.phi + step;

				if (newPhiAngle < 89 && newPhiAngle > -89)
					camera.current.polarCoord.phi = newPhiAngle;
			};

			if      (angle === "theta") ModifyThetaAngle();
			else if (angle === "phi")   ModifyPhiAngle();
		};

		function ModifyAnchor(step:1|-1, axis:"x"|"y"|"z"):void
		{
			if      (axis === "x") camera.current.anchor.x += step;
			else if (axis === "y") camera.current.anchor.y += step;
			else if (axis === "z") camera.current.anchor.z += step;
		};

		function MoveRight():void
		{
			if      (camera.current.eventTarger === "camera") ModifyCameraAngle(1, "theta");
			else if (camera.current.eventTarger === "anchor") ModifyAnchor(1, "y");

			Utils.RenderFrame(canvasRef, [...coordinateSystemBases_3D], modelMesh.current, camera.current);
		};

		function MoveLeft():void
		{
			if      (camera.current.eventTarger === "camera") ModifyCameraAngle(-1, "theta");
			else if (camera.current.eventTarger === "anchor") ModifyAnchor(-1, "y");

			Utils.RenderFrame(canvasRef, [...coordinateSystemBases_3D], modelMesh.current, camera.current);
		};

		function MoveUp(e:KeyboardEvent):void
		{
			if      (camera.current.eventTarger === "camera") ModifyCameraAngle(1, "phi");
			else if (camera.current.eventTarger === "anchor")
			{
				if (e.ctrlKey) ModifyAnchor(1, "x");
				else           ModifyAnchor(1, "z");
			}

			Utils.RenderFrame(canvasRef, [...coordinateSystemBases_3D], modelMesh.current, camera.current);
		};

		function MoveDown(e:KeyboardEvent):void
		{
			if      (camera.current.eventTarger === "camera") ModifyCameraAngle(-1, "phi");
			else if (camera.current.eventTarger === "anchor")
			{
				if (e.ctrlKey) ModifyAnchor(-1, "x");
				else           ModifyAnchor(-1, "z");
			}

			Utils.RenderFrame(canvasRef, [...coordinateSystemBases_3D], modelMesh.current, camera.current);
		};

		if      (e.key === 'a'         ) camera.current.eventTarger = "anchor";
		else if (e.key === 'c'         ) camera.current.eventTarger = "camera";
		else if (e.key === "ArrowRight") MoveRight     ();
		else if (e.key === "ArrowLeft" ) MoveLeft      ();
		else if (e.key === "ArrowUp"   ) MoveUp        (e);
		else if (e.key === "ArrowDown" ) MoveDown      (e);
	};

	return (
		<canvas
			ref      ={canvasRef}
			className={Style.canvasContainer}
		/>
	);
};
