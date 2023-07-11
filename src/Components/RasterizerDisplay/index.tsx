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
	const ref : React.RefObject<HTMLCanvasElement> = React.useRef(null);

	const mesh : React.MutableRefObject<Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[]> = React.useRef([]);

	const camera : React.MutableRefObject<PolarCamera.Types.T_PolarCamera> = React.useRef(props.defaultCamera);
	const [cameraDebug, setCameraDebug] = React.useState<PolarCamera.Types.T_PolarCamera>(props.defaultCamera);

	React.useEffect(() =>
	{
		mesh.current = props.mesh;
		Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, camera.current);
	}, [props.mesh]);

	React.useEffect(() => { props.cameraDebug(cameraDebug); }, [cameraDebug]);
	
	React.useEffect(() =>
	{
		function AddEvents(elemRef : React.RefObject<HTMLCanvasElement>) : void
		{
			if (elemRef.current)
			{
				elemRef.current.addEventListener("wheel"  , OnScroll );
				document       .addEventListener("keydown", OnKeydown);
				window         .addEventListener("resize" , OnResize );
			}
		};
		function RemoveEvents(elemRef : React.RefObject<HTMLCanvasElement>) : void
		{
			if (elemRef.current)
			{
				elemRef.current.removeEventListener("wheel"  , OnScroll );
				document       .removeEventListener("keydown", OnKeydown);
				window         .removeEventListener("resize" , OnResize );
			}
		};
		
		AddEvents(ref);
		OnResize();
		Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, camera.current);
		
		return (() => { RemoveEvents(ref); });
	}, []);
	
	function ForceRedrawing<T>(
		e              : T,
		camera         : PolarCamera.Types.T_PolarCamera,
		setCameraDebug : React.Dispatch<React.SetStateAction<PolarCamera.Types.T_PolarCamera>>,
		callback       : Types.T_EventCameraCallback<T>,
	) : void
	{
		if (ref.current != null && callback(e, camera, setCameraDebug))
			Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, camera);
	};

	function OnScroll(e : WheelEvent) : void
	{
		ForceRedrawing(e, camera.current, setCameraDebug, Event.ZoomCamera);
		props.cameraDebug(camera.current);
	};
	
	function OnKeydown(e : KeyboardEvent) : void
	{
		if (!Event.ChangeCameraMode(e, camera.current, setCameraDebug))
		{
			if (camera.current.eventTarger === "anchor") ForceRedrawing(e, camera.current, setCameraDebug, Event.DragCamera);
			else                                         ForceRedrawing(e, camera.current, setCameraDebug, Event.RotateCamera);
		}

		props.cameraDebug(camera.current);
	};

	function OnResize() : void
	{
		if (ref.current)
		{
			ref.current.width  = ref.current.clientWidth;
			ref.current.height = ref.current.clientHeight;

			if (ref.current != null)
				Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, camera.current);
		}
	};
	
	return (
		<canvas
			ref      ={ref}
			className={Style.canvasContainer}
		/>
	);
};

export * as Utils from "./utils";
