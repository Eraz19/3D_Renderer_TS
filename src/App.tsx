import React from "react";

import * as Polygone          from "./Utils/Shapes/Polygone";
import * as PolarCamera       from "./Utils/Rasterizer/PolarCamera";
import * as Window            from "./Components/Window";
import * as RasterizerDisplay from "./Components/RasterizerDisplay";
import * as SearchReadFile    from "./Components/SearchReadFile";
import * as Debug             from "./Components/Debug";
import      Style             from "./style.module.scss";


function App()
{
	const [mesh      , setMesh      ] = React.useState<Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[]>([]);
	const [debugPanel, setDebugPanel] = React.useState<RasterizerDisplay.Types.T_CameraState>();

	const [isWindowActionsLocked    , setIsWindowActionsLocked    ] = React.useState<boolean>(false);
	const [isRasterizerActionsLocked, setIsRasterizerActionsLocked] = React.useState<boolean>(false);

	return (
		<>
			{/*<SearchReadFile.Component
				getMeshModel ={setMesh}
				fileExtension={"obj"}
			/>
			
			<div className={Style.DebugPanel}>
				<Debug.PolarCamera.Conponment
					camera={debugPanel}
				/>
			</div>*/}
			<Window.Component
				resizeEnabled = {!isWindowActionsLocked}
				moveEnabled   = {!isWindowActionsLocked}
				onStartResize = {() => { setIsRasterizerActionsLocked(true ); }}
				onEndResize   = {() => { setIsRasterizerActionsLocked(false); }}
				onStartMove   = {() => { setIsRasterizerActionsLocked(true ); }}
				onEndMove     = {() => { setIsRasterizerActionsLocked(false); }}
				window        =
				{
					{
						width       : 1400,
						height      : 800,
						left        : 100,
						top         : 100,
					}
				}
			>
				<RasterizerDisplay.Component
					mesh          = {mesh}
					cameraDebug   = {setDebugPanel}
					dragEnabled   = {!isRasterizerActionsLocked}
					zoomEnabled   = {!isRasterizerActionsLocked}
					rotateEnabled = {!isRasterizerActionsLocked}
					onStartDrag   = {() => { setIsWindowActionsLocked(true ); }}
					onEndDrag     = {() => { setIsWindowActionsLocked(false); }}
					onStartRotate = {() => { setIsWindowActionsLocked(true ); }}
					onEndRotate   = {() => { setIsWindowActionsLocked(false); }}
					zoomSettings  = 
					{
						{
							maxRadius: 5,
							minRadius: 1,
						}
					}
					defaultCamera =
					{
						{
							anchor     :
							{
								x: 0,
								y: 0,
								z: 0,
							},
							polarCoord :
							{
								radius: 1.5,
								theta :  22,
								phi   :  25,
							},
						}
					}
				/>
			</Window.Component>
		</>
	);
};

export default App;
