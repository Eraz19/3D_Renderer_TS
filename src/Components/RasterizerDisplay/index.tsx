import * as React   from "react";
import * as ErazLib from "eraz-lib";


import * as Rasterizer from "./Rasterizer";
import * as Overlay    from "./Overlay";
import * as Event      from "./event";
import * as Types      from "./types";
import      Style      from "./style.module.scss";


const DEFAULT_DRAG_FACTOR   : number = 0.7;
const DEFAULT_ROTATE_FACTOR : number = 0.3;
const DEFAULT_ZOOM_FACTOR   : number = 0.1;

const RASTERIZER_BACKGROUND_COLOR : ErazLib.Graphic.Color.RGB.Types.T_Color = { red: 92, green: 92, blue: 92 };

const NUMBER_OF_FRAME_PER_SECOND : number = 30;

export const RasterizerContext = React.createContext<Rasterizer.Types.T_RasterizerContext>({});


export function Component(props : Types.T_Props) : JSX.Element
{
    const input   = React.useRef<Types.T_Input>                       (InitializeInput  ());
    const event   = React.useRef<Types.T_Event>                       (IntializeEvent   ());
    const context = React.useRef<Rasterizer.Types.T_RasterizerContext>(InitializeContext());

    const [isMouseDown , setIsMouseDown] = React.useState<boolean>(false);
    const [opentOverlay, setOpenOverlay] = React.useState<boolean>(false);

    React.useEffect(() => { input.current.keyboard.keybindings = KeyBinding(props.keyboardSettings?.keybindings); }, [props.keyboardSettings?.keybindings]);
    React.useEffect(() => { event.current.rotateEnabled        = props.rotateSettings?.enabled ?? true;           }, [props.rotateSettings  ?.enabled    ]);
	React.useEffect(() => { event.current.dragEnabled          = props.dragSettings  ?.enabled ?? true;           }, [props.dragSettings    ?.enabled    ]);
	React.useEffect(() => { event.current.zoomEnabled          = props.zoomSettings  ?.enabled ?? true;           }, [props.zoomSettings    ?.enabled    ]);
    React.useEffect(() => { event.current.zoomEnabled          = props.zoomSettings  ?.enabled ?? true;           }, [props.zoomSettings    ?.enabled    ]);
    React.useEffect(() =>
    {        
        context.current.modelMesh    = { edges: props.mesh.edges, vertices : ResizeMeshVerticesToFitCoordinateSystem(props.mesh.vertices) };
        context.current.meshToRender = Rasterizer.Utils.MergeMeshes([context.current.coordinateSystemBases, context.current.modelMesh]); 
    }, [props.mesh]);

    React.useEffect(() =>
	{
		function AddEvents() : void
		{
            window.addEventListener("keydown", HandleKeyDown);
            window.addEventListener("keyup"  , HandleKeyUp  );
		};
		
		function RemoveEvents() : void
		{
			window.removeEventListener("keydown", HandleKeyDown);
			window.removeEventListener("keyup"  , HandleKeyUp  );
		};
		
		AddEvents();
		
		return (RemoveEvents);
	}, []);

    /**************************** Utils ****************************/

    function ResizeMeshVerticesToFitCoordinateSystem(meshVertices : Rasterizer.Types.T_ModelMesh_Vertices) : Rasterizer.Types.T_ModelMesh_Vertices
    {
        if (context.current.coordinateSystemBasesSize)
        {
            let factor : number = 1;

            const coordinateSystemBasesSize : number = context.current.coordinateSystemBasesSize;
            const maxVerticesX : number = Math.max(...meshVertices.map((vertex : Rasterizer.Types.T_ModelMesh_Vertex) : number => { return(Math.abs(vertex[0])); }));
            const maxVerticesY : number = Math.max(...meshVertices.map((vertex : Rasterizer.Types.T_ModelMesh_Vertex) : number => { return(Math.abs(vertex[1])); }));
            const maxVerticesZ : number = Math.max(...meshVertices.map((vertex : Rasterizer.Types.T_ModelMesh_Vertex) : number => { return(Math.abs(vertex[2])); }));
            const maxValue     : number = Math.max(...[maxVerticesX, maxVerticesY, maxVerticesZ]);
    
            if       (maxValue > coordinateSystemBasesSize) factor = 1 / (maxValue / coordinateSystemBasesSize);
            else if  (maxValue < coordinateSystemBasesSize) factor = coordinateSystemBasesSize / maxValue;
    
            return (
                meshVertices.map((vertex : Rasterizer.Types.T_ModelMesh_Vertex) : Rasterizer.Types.T_ModelMesh_Vertex =>
                {
                    return ([vertex[0] * factor,vertex[2] * factor,vertex[1] * factor]);
                })
            );
        }
        else
            return ([]);
    };

    function InitializeContext() : Rasterizer.Types.T_RasterizerContext
    {
        return (
            {
                camera    : InitializeCamera(),
                background: RASTERIZER_BACKGROUND_COLOR,
                renderLoop: InitalizeRenderLoop(),   
            }
        );
    };

    function InitializeInput() : Types.T_Input
    {
        return (
            {
                mouse   : { status: Types.E_MouseStatus.UP },
                keyboard:
                {
                    stack      : new Set<string>(),
                    keybindings: KeyBinding(props.keyboardSettings?.keybindings),
                },
            }
        );
    };

    function IntializeEvent() : Types.T_Event
    {
        return (
            {
                action         : Types.E_RasterizerAction.NONE,
                dragEnabled    : props.dragSettings    ?.enabled ?? true,
                rotateEnabled  : props.rotateSettings  ?.enabled ?? true,
                zoomEnabled    : props.zoomSettings    ?.enabled ?? true,
                keyboardEnabled: props.keyboardSettings?.enabled ?? true,
            }
        );
    };

    function InitalizeRenderLoop() : Rasterizer.Types.T_RenderLoopState
    {
        return (
            {
                frameTime : 1 / NUMBER_OF_FRAME_PER_SECOND,
                frameCount: 0,
            }
        );
    };

    function InitializeCamera() : Rasterizer.Types.T_CameraState
    {
        return (
            {
                ...Rasterizer.Utils.PolarCameraDeepCopy(props.defaultCamera),
                initialAnchor: {...props.defaultCamera.anchor},
                initialCamera: {...props.defaultCamera.polarCoord},
            }
        );
    };

    function MouseDown_ToClassName() : string
    {
		if (isMouseDown && event.current.dragEnabled && event.current.rotateEnabled) return (Style.MouseDown);
		else                                                                         return ("");
    };

    function KeyBinding(keybindings ?: Types.T_KeyBindingsSetting) : Types.T_KeyBindings
	{
		return (
			{
				rotateCamera: { keys: (keybindings?.rotateCamera == null || keybindings.rotateCamera.length === 0) ? ["Control"] : keybindings.rotateCamera     , action: "Drag" },
                dragCamera  : { keys: []                                                                                                                        , action: "Drag" },
				resetAnchor : { keys: (keybindings?.resetAnchor  == null || keybindings.resetAnchor .length === 0) ? ["Control", "c"] : keybindings.resetAnchor , action: ""     },
				resetCamera : { keys: (keybindings?.resetCamera  == null || keybindings.resetCamera .length === 0) ? ["Control", "v"] : keybindings.resetCamera , action: ""     },
                openOverlay : { keys: ["Alt"]                                                                                                                   , action: ""     },
			}
		);
	};

    function IsKeyBindingCompleted(
        keybindings     : Types.T_KeyBindings,
		keyBindingName  : keyof Types.T_KeyBindings,
		keyPressed     ?: string,
	) : boolean
	{
		const keyBinding : string[] | undefined = keybindings[keyBindingName]?.keys;

		function AllOtherKeysArePressed(
			keyBinding  : string[],
			keyPressed ?: string,
		) : boolean
		{
			return (
				keyBinding
				.map((keyBindingElement : string) : boolean =>
				{
					if (keyBindingElement === keyPressed) return (true);
					else                                  return (input.current.keyboard.stack.has(keyBindingElement));
				})
				.reduce((prev : boolean, current : boolean) : boolean => { return (prev && current); }, true)
			);
		};

		if (keyBinding && AllOtherKeysArePressed(keyBinding, keyPressed)) return ((keyPressed) ? keyBinding.includes(keyPressed) : true);
		else                                                              return (false);
	};
    
	function ResetAnchorPosition() : void
	{
        if (context.current.camera)
            context.current.camera.anchor = { ...context.current.camera.initialAnchor };
	};

	function ResetCamera() : void
	{
        if (context.current.camera)
            context.current.camera.polarCoord = { ...context.current.camera.initialCamera };
	};

    function ReportCameraUpdate() : void
	{
		if (props.cameraDebug) 
			props.cameraDebug(context.current.camera);
	};

	function OnDragStart() : void
    {
        if (event.current.action !== Types.E_RasterizerAction.DRAG)
        {
            event.current.action = Types.E_RasterizerAction.DRAG;
			ReportCameraUpdate();

            if (props.onStartDrag)
                props.onStartDrag();
        }
    };

    function OnDragEnd() : void
    {
        if (event.current.action === Types.E_RasterizerAction.DRAG)
		{
			event.current.action = Types.E_RasterizerAction.NONE;
			ReportCameraUpdate();

			if (props.onEndDrag)
				props.onEndDrag();
		}
    };

    function OnRotateStart() : void
    {
        if (event.current.action !== Types.E_RasterizerAction.ROTATE)
        {
            event.current.action = Types.E_RasterizerAction.ROTATE;
			ReportCameraUpdate();

            if (props.onStartRotate)
                props.onStartRotate();
        }
    };

    function OnRotateEnd() : void
    {
        if (event.current.action === Types.E_RasterizerAction.ROTATE)
		{
			event.current.action = Types.E_RasterizerAction.NONE;
			ReportCameraUpdate();

			if (props.onEndRotate)
				props.onEndRotate();
		}
    };

	function OnZoomStart() : void
    {
        if (event.current.action !== Types.E_RasterizerAction.ZOOM)
        {
            event.current.action = Types.E_RasterizerAction.ZOOM;
			ReportCameraUpdate();
        }
    };

    function OnZoomEnd() : void
    {
        if (event.current.action === Types.E_RasterizerAction.ZOOM)
		{
			event.current.action = Types.E_RasterizerAction.NONE;
			ReportCameraUpdate();
		}
    };

    /**************************** Events Handler ****************************/

	function HandleMouseUp() : void
	{
        input.current.mouse.status = Types.E_MouseStatus.UP;
        setIsMouseDown(false);

        if (event.current.action !== Types.E_RasterizerAction.NONE)
        {
            OnDragEnd  ();
            OnRotateEnd();
			OnZoomEnd  ();
        }
	};

    function HandleMouseDown() : void
	{
		input.current.mouse.status = Types.E_MouseStatus.DOWN;
        setIsMouseDown(true);
	};

    function HandleKeyUp(e : KeyboardEvent) : void
	{
        if (event.current.keyboardEnabled)
        {
            if      (IsKeyBindingCompleted(input.current.keyboard.keybindings, "rotateCamera", e.key)) OnRotateEnd();
            else if (IsKeyBindingCompleted(input.current.keyboard.keybindings, "openOverlay" , e.key)) setOpenOverlay(false);

		    input.current.keyboard.stack.delete(e.key);
        }
	};

    function HandleKeyDown(e : KeyboardEvent) : void
	{
        if (event.current.keyboardEnabled)
        {
            if      (IsKeyBindingCompleted(input.current.keyboard.keybindings, "resetAnchor", e.key)) ResetAnchorPosition();
            else if (IsKeyBindingCompleted(input.current.keyboard.keybindings, "resetCamera", e.key)) ResetCamera();
            else if (IsKeyBindingCompleted(input.current.keyboard.keybindings, "openOverlay", e.key)) setOpenOverlay(true);
    
            input.current.keyboard.stack.add(e.key);
        }
	};

    function HandleMouseMove(e : React.MouseEvent<HTMLDivElement, MouseEvent>) : void
	{
		function RotateCamera(
			mouseMoveX : number,
			mouseMoveY : number,
		) : void
		{
			const rotateFactor : number = props.rotateSettings?.rotateFactor ?? DEFAULT_ROTATE_FACTOR;
			const deltaTheta   : number = (props.rotateSettings?.rotateMode === Types.E_CameraMode.INVERSE) ? rotateFactor *  mouseMoveX : rotateFactor * -mouseMoveX;
			const deltaPhi     : number = (props.rotateSettings?.rotateMode === Types.E_CameraMode.INVERSE) ? rotateFactor * -mouseMoveY : rotateFactor *  mouseMoveY;

			if (context.current.camera && Event.RotateCamera(deltaTheta, deltaPhi, context.current.camera, props.cameraDebug))
				OnRotateStart();
		};

		function DragAnchor(
			mouseMoveX : number,
			mouseMoveY : number,
		) : void
		{
			OnDragStart();

			const dragFactor : number = (props.dragSettings?.dragFactor ?? DEFAULT_DRAG_FACTOR) * (1 / (context.current.camera?.polarCoord[2] ?? 1));
			const deltaX     : number = (props.dragSettings?.dragMode === Types.E_CameraMode.INVERSE) ? dragFactor *  mouseMoveX : dragFactor * -mouseMoveX;
			const deltaY     : number = (props.dragSettings?.dragMode === Types.E_CameraMode.INVERSE) ? dragFactor * -mouseMoveY : dragFactor *  mouseMoveY;

            if (context.current.camera)
                Event.DragCamera(deltaX, deltaY, context.current.camera, props.cameraDebug);
		}

		if (input.current.mouse.status === Types.E_MouseStatus.DOWN)
		{	
			if      (IsKeyBindingCompleted(input.current.keyboard.keybindings, "rotateCamera") && event.current.rotateEnabled) RotateCamera(e.movementX, e.movementY);
			else if (event.current.dragEnabled)                                                                                DragAnchor  (e.movementX, e.movementY);
		}
	};

	function HandleWeel(e : React.WheelEvent<HTMLDivElement>) : void
	{
		function GetMinZoom() : number | undefined
		{
			if (props.zoomSettings?.minRadius == null) return (undefined);
			else
			{
				if
				(
					props.zoomSettings.minRadius < 0 ||
					props.zoomSettings.minRadius > props.defaultCamera.polarCoord[2] ||
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
				if (props.zoomSettings.maxRadius < props.defaultCamera.polarCoord[2])
					return (undefined);
				else
					return (props.zoomSettings.maxRadius);
			}
		};

		const userZoomFactor : number = props.zoomSettings?.zoomFactor ?? DEFAULT_ZOOM_FACTOR;
		const zoomFactor     : number = (e.deltaY > 0) ? userZoomFactor : -userZoomFactor;

		if (context.current.camera && event.current.zoomEnabled && Event.ZoomCamera(zoomFactor, context.current.camera, GetMinZoom(), GetMaxZoom(), props.cameraDebug))
			OnZoomStart();
	};

    return (
        <RasterizerContext.Provider value={context.current}>
            <div className={Style.Container}>
                <div
                    className    = {`${Style.Rasterizer} ${MouseDown_ToClassName()}`}
                    onMouseLeave = {HandleMouseUp}
                    onMouseUp    = {HandleMouseUp}
                    onMouseDown  = {HandleMouseDown}
                    onMouseMove  = {HandleMouseMove}
                    onWheel      = {HandleWeel}
                >
                    <Rasterizer.Component/>
                </div>
                {
                    opentOverlay &&
                    <div className={Style.Overlay}>
                        <Overlay.Component keyBindings={input.current.keyboard.keybindings}/>
                    </div>
                }
            </div>
        </RasterizerContext.Provider>
    );
};

export * as Rasterizer from "./Rasterizer";
