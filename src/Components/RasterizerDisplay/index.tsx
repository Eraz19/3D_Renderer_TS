import React from "react";

import * as Polygone    from "../../Utils/Shapes/Polygone";
import * as PolarCamera from "../../Utils/Rasterizer/PolarCamera";
import * as Types       from "./types";
import * as Event       from "./event";
import * as Utils       from "./utils";
import * as Variables   from "./variables";
import      Style       from "./style.module.scss";


export const Component = (props : Types.T_Props) : JSX.Element =>
{
	const ref          = React.useRef<HTMLCanvasElement>(null);
	const mesh         = React.useRef<Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[]>([]);
	const mouse        = React.useRef<Types.T_MousePosition|undefined>(undefined);
	const keydownStack = React.useRef<Set<string>>(new Set());
	const camera       = React.useRef<Types.T_Camera>(
		{
			...props.defaultCamera,
			initialAnchor      : { x: props.defaultCamera.anchor.x, y: props.defaultCamera.anchor.y, z: props.defaultCamera.anchor.z },
			cameraToWorldMatrix: undefined,
		}
	);

	const [cameraDebug, setCameraDebug] = React.useState<PolarCamera.Types.T_PolarCamera>(props.defaultCamera);

	React.useEffect(() =>
	{
		mesh.current = props.mesh;
		Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, camera.current);
	}, [props.mesh]);

	React.useEffect(() =>
	{
		props.cameraDebug(cameraDebug);
	}, [cameraDebug]);
	
	React.useEffect(() =>
	{
		const observer = new ResizeObserver(OnResize);

		function AddEvents(elemRef : React.RefObject<HTMLCanvasElement>) : void
		{
			if (elemRef.current)
			{
				observer.observe         (elemRef.current);
				window  .addEventListener("keydown", OnKeydown);
				window  .addEventListener("keyup"  , onKeyUp  );
			}
		};
		function RemoveEvents(elemRef : React.RefObject<HTMLCanvasElement>) : void
		{
			if (elemRef.current)
			{
				observer.disconnect         ();
				window  .removeEventListener("keydown", OnKeydown);
				window  .removeEventListener("keyup"  , onKeyUp  );
			}
		};
		
		AddEvents(ref);
		
		return (() => { RemoveEvents(ref); });
	}, []);
	

	function MouseDown(e : React.MouseEvent<HTMLCanvasElement, MouseEvent>) : void
	{
		mouse.current = { x: e.clientX, y: e.clientY };
	};

	function MouseUp() : void
	{
		mouse.current = undefined;
	};

	function MouseMove(e : React.MouseEvent<HTMLCanvasElement, MouseEvent>) : void
	{
		if (mouse.current != null)
		{
			const mouseMoveX : number = e.clientX - mouse.current.x;
			const mouseMoveY : number = e.clientY - mouse.current.y;

			if (camera.current.eventTarger === "camera" && Event.RotateCamera(-mouseMoveX, mouseMoveY, camera.current, setCameraDebug))
				Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, camera.current);
			else
			{
				Event.DragCamera(-mouseMoveX, -mouseMoveY, camera.current, setCameraDebug);
				Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, camera.current);
			}

			mouse.current = { x: e.clientX, y: e.clientY };
		}
	};

	function onKeyUp(e : KeyboardEvent) : void
	{
		if (e.key === "Control")
		{
			camera.current.eventTarger = "anchor";
			props.cameraDebug(camera.current);
		}

		keydownStack.current.delete(e.key);
	};

	function OnKeydown(e : KeyboardEvent) : void
	{
		console.log(e.key);

		if (e.key === "Control")
		{
			camera.current.eventTarger = "camera";
			props.cameraDebug(camera.current);
		}
		else if (e.key === "c" && keydownStack.current.has("Control"))
		{
			camera.current.anchor = { ...camera.current.initialAnchor };
			console.log(props.defaultCamera.anchor);
			Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, camera.current);
		}

		keydownStack.current.add(e.key);
	};

	// Zoom event
	function OnScroll(e : React.WheelEvent<HTMLCanvasElement>) : void
	{
		if (Event.ZoomCamera(e.deltaY, camera.current, setCameraDebug))
			Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, camera.current);
	};

	function OnResize() : void
	{
		if (ref.current)
		{
			ref.current.width  = ref.current.clientWidth;
			ref.current.height = ref.current.clientHeight;

			Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, camera.current);
		}
	};
	
	return (
		<canvas
			ref         = {ref}
			className   = {Style.canvasContainer}
			onWheel     = {OnScroll}
			onMouseDown = {MouseDown}
			onMouseUp   = {MouseUp}
			onMouseMove = {MouseMove}
		/>
	);
};

export * as Utils from "./utils";
