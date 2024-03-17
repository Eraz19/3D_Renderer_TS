import React from "react";

import * as Polygone    from "../../Utils/Shapes/Polygone";
import * as PolarCamera from "../../Utils/Rasterizer/PolarCamera";
import * as Color       from "../../Utils/Color";
import * as Types       from "./types";
import * as Event       from "./event";
import * as Utils       from "./utils";
import * as Variables   from "./variables";
import      Style       from "./style.module.scss";


const DEFAULT_DRAG_FACTOR   : number = 0.6;
const DEFAULT_ROTATE_FACTOR : number = 0.3;
const DEFAULT_ZOOM_FACTOR   : number = 0.1;

const RASTERIZER_BACKGROUND_COLOR : Color.RGB.Types.T_Color = { red: 92, green: 92, blue: 92 };

export const Component = (props : Types.T_Props) : JSX.Element =>
{
	const ref          = React.useRef<HTMLCanvasElement>(null);
	const mesh         = React.useRef<Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[]>([]);
	const input        = React.useRef<Types.T_RasterizerInput>(
		{
			mouse   : { status: Types.E_MouseStatus.UP },
			keyboard: { stack : new Set<string>()      },
		}
	);
	const cameraState  = React.useRef<Types.T_CameraState>(
		{
			...PolarCamera.Utils.DeepCopy(props.defaultCamera),
			initialAnchor: {...props.defaultCamera.anchor},
			initialCamera: {...props.defaultCamera.polarCoord},
			action       : Types.E_RasterizerAction.NONE,
			dragEnabled  : props.dragEnabled,
			rotateEnabled: props.rotateEnabled,
			zoomEnabled  : props.zoomEnabled,
		}
	);

	React.useEffect(() => { cameraState.current.rotateEnabled = props.rotateEnabled; }, [props.rotateEnabled]);
	React.useEffect(() => { cameraState.current.dragEnabled   = props.dragEnabled;   }, [props.dragEnabled  ]);
	React.useEffect(() => { cameraState.current.zoomEnabled   = props.zoomEnabled;   }, [props.zoomEnabled  ]);

	React.useEffect(() =>
	{
		mesh.current = props.mesh;
		Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, cameraState.current, RASTERIZER_BACKGROUND_COLOR);
	}, [props.mesh]);

	React.useEffect(() =>
	{
		const observer = new ResizeObserver(HandleResizeResize);

		function AddEvents(elemRef : React.RefObject<HTMLCanvasElement>) : void
		{
			if (elemRef.current)
			{
				observer.observe         (elemRef.current);
				window  .addEventListener("keydown", HandleKeydown);
				window  .addEventListener("keyup"  , HandleKeyUp  );
			}
		};
		
		function RemoveEvents(elemRef : React.RefObject<HTMLCanvasElement>) : void
		{
			if (elemRef.current)
			{
				observer.disconnect         ();
				window  .removeEventListener("keydown", HandleKeydown);
				window  .removeEventListener("keyup"  , HandleKeyUp  );
			}
		};
		
		AddEvents(ref);
		
		return (() => { RemoveEvents(ref); });
	}, []);

	/**************************** Utils ****************************/

    function MouseDown_ToClassName() : string
    {
		if
		(
			input.current.mouse.status === Types.E_MouseStatus.DOWN &&
			cameraState.current.dragEnabled                         &&
			cameraState.current.rotateEnabled
		)
			return (Style.MouseDown);
		else
			return ("");
    };

	function ReportCameraUpdate() : void
	{
		if (props.cameraDebug) 
			props.cameraDebug(cameraState.current);
	};

	function ResetAnchorPosition() : void
	{
		cameraState.current.anchor = { ...cameraState.current.initialAnchor };

		Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, cameraState.current, RASTERIZER_BACKGROUND_COLOR);
	};

	function ResetCamera() : void
	{
		cameraState.current.polarCoord = { ...cameraState.current.initialCamera };

		Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, cameraState.current, RASTERIZER_BACKGROUND_COLOR);
	};

	function OnDragStart() : void
    {
        if (cameraState.current.action !== Types.E_RasterizerAction.DRAG)
        {
            cameraState.current.action = Types.E_RasterizerAction.DRAG;
			ReportCameraUpdate();

            if (props.onStartDrag)
                props.onStartDrag();
        }
    };

    function OnDragEnd() : void
    {
        if (cameraState.current.action === Types.E_RasterizerAction.DRAG)
		{
			cameraState.current.action = Types.E_RasterizerAction.NONE;
			ReportCameraUpdate();

			if (props.onEndDrag)
				props.onEndDrag();
		}
    };

    function OnRotateStart() : void
    {
        if (cameraState.current.action !== Types.E_RasterizerAction.ROTATE)
        {
            cameraState.current.action = Types.E_RasterizerAction.ROTATE;
			ReportCameraUpdate();

            if (props.onStartRotate)
                props.onStartRotate();
        }
    };

    function OnRotateEnd() : void
    {
        if (cameraState.current.action === Types.E_RasterizerAction.ROTATE)
		{
			cameraState.current.action = Types.E_RasterizerAction.NONE;
			ReportCameraUpdate();

			if (props.onEndRotate)
				props.onEndRotate();
		}
    };

	function OnZoomStart() : void
    {
        if (cameraState.current.action !== Types.E_RasterizerAction.ZOOM)
        {
            cameraState.current.action = Types.E_RasterizerAction.ZOOM;
			ReportCameraUpdate();
        }
    };

    function OnZoomEnd() : void
    {
        if (cameraState.current.action === Types.E_RasterizerAction.ZOOM)
		{
			cameraState.current.action = Types.E_RasterizerAction.NONE;
			ReportCameraUpdate();
		}
    };

    /**************************** Events Handler ****************************/

	function HandleMouseUp() : void
	{
        input.current.mouse.status = Types.E_MouseStatus.UP;

        if (cameraState.current.action !== Types.E_RasterizerAction.NONE)
        {
            OnDragEnd   ();
            OnRotateEnd ();
			OnZoomEnd   ();
        }
	};

	function HandleMouseDown(e : React.MouseEvent<HTMLCanvasElement, MouseEvent>) : void
	{
		input.current.mouse.status = Types.E_MouseStatus.DOWN;
	};

	function HandleKeyUp(e : KeyboardEvent) : void
	{
		if (e.key === "Control")
			OnRotateEnd();

		input.current.keyboard.stack.delete(e.key);
	};

	function HandleKeydown(e : KeyboardEvent) : void
	{                    
		if      (e.key === "c" && input.current.keyboard.stack.has("Control")) ResetAnchorPosition();
		else if (e.key === "v" && input.current.keyboard.stack.has("Control")) ResetCamera();

		input.current.keyboard.stack.add(e.key);
	};

	function HandleMouseMove(e : React.MouseEvent<HTMLCanvasElement, MouseEvent>) : void
	{
		function RotateCamera(
			mouseMoveX : number,
			mouseMoveY : number,
		) : void
		{
			const rotateFactor : number = props.rotateSettings?.rotateFactor ?? DEFAULT_ROTATE_FACTOR;
			const deltaTheta   : number = (props.rotateSettings?.rotateMode === Types.E_CameraMode.INVERSE) ? rotateFactor *  mouseMoveX : rotateFactor * -mouseMoveX;
			const deltaPhi     : number = (props.rotateSettings?.rotateMode === Types.E_CameraMode.INVERSE) ? rotateFactor * -mouseMoveY : rotateFactor *  mouseMoveY;

			if (Event.RotateCamera(deltaTheta, deltaPhi, cameraState.current, props.cameraDebug))
			{
				OnRotateStart();
				Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, cameraState.current, RASTERIZER_BACKGROUND_COLOR);
			}
		};

		function DragAnchor(
			mouseMoveX : number,
			mouseMoveY : number,
		) : void
		{
			OnDragStart();

			const dragFactor : number = props.dragSettings?.dragFactor ?? DEFAULT_DRAG_FACTOR;
			const deltaX     : number = (props.dragSettings?.dragMode === Types.E_CameraMode.INVERSE) ? dragFactor *  mouseMoveX : dragFactor * -mouseMoveX;
			const deltaY     : number = (props.dragSettings?.dragMode === Types.E_CameraMode.INVERSE) ? dragFactor * -mouseMoveY : dragFactor *  mouseMoveY;

			Event.DragCamera (deltaX, deltaY, cameraState.current, props.cameraDebug);
			Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, cameraState.current, RASTERIZER_BACKGROUND_COLOR);
		}

		if (input.current.mouse.status === Types.E_MouseStatus.DOWN)
		{	
			if      (input.current.keyboard.stack.has("Control") && cameraState.current.rotateEnabled) RotateCamera(e.movementX, e.movementY);
			else if (cameraState.current.dragEnabled)                                                  DragAnchor  (e.movementX, e.movementY);
		}
	};

	function HandleWeel(e : React.WheelEvent<HTMLCanvasElement>) : void
	{
		function GetMinZoom() : number | undefined
		{
			if (props.zoomSettings?.minRadius == null) return (undefined);
			else
			{
				if
				(
					props.zoomSettings.minRadius < 0 ||
					props.zoomSettings.minRadius > props.defaultCamera.polarCoord.radius ||
					(props.zoomSettings.maxRadius && props.zoomSettings.minRadius > props.zoomSettings.maxRadius)
				)
					return (undefined);
				else
					return (props.zoomSettings.minRadius);
			}
		};

		function GetMaxZoom() : number | undefined
		{
			if (props.zoomSettings?.maxRadius == null) return (undefined);
			else
			{
				if (props.zoomSettings.maxRadius < props.defaultCamera.polarCoord.radius)
					return (undefined);
				else
					return (props.zoomSettings.maxRadius);
			}
		};

		const userZoomFactor : number = props.zoomSettings?.zoomFactor ?? DEFAULT_ZOOM_FACTOR;
		const zoomFactor     : number = (e.deltaY > 0) ? userZoomFactor : -userZoomFactor;

		if (cameraState.current.zoomEnabled && Event.ZoomCamera(zoomFactor, cameraState.current, GetMinZoom(), GetMaxZoom(), props.cameraDebug))
		{
			OnZoomStart();
			Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, cameraState.current, RASTERIZER_BACKGROUND_COLOR);
		}
	};

	function HandleResizeResize() : void
	{
		if (ref.current)
		{
			ref.current.width  = ref.current.clientWidth;
			ref.current.height = ref.current.clientHeight;

			Utils.RenderFrame(ref.current, Variables.coordinateSystemBases_3D, mesh.current, cameraState.current, RASTERIZER_BACKGROUND_COLOR);
		}
	};
	
	return (
		<canvas
			ref          = {ref}
			className    = {`${Style.canvasContainer} ${MouseDown_ToClassName()}`}
			onWheel      = {HandleWeel}
			onMouseDown  = {HandleMouseDown}
			onMouseUp    = {HandleMouseUp}
			onMouseMove  = {HandleMouseMove}
			onMouseLeave = {HandleMouseUp}
		/>
	);
};

export * as Utils from "./utils";
export * as Types from "./types";
