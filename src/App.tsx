import React from "react";

import * as Polygone           from "./Utils/Shapes/Polygone";
import * as PolarCamera        from "./Utils/Rasterizer/PolarCamera";
import * as Window             from "./Components/Window";
import * as TilinWindowManager from "./Components/TilingWindowManager";
import * as RasterizerDisplay  from "./Components/RasterizerDisplay";
import * as SearchReadFile     from "./Components/SearchReadFile";
import * as Debug              from "./Components/Debug";
import      Style              from "./style.module.scss";


function App()
{
	const [mesh      , setMesh      ] = React.useState<Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[]>([]);
	//const [debugPanel, setDebugPanel] = React.useState<RasterizerDisplay.Types.T_CameraState>();

	const [isWindowActionsLocked    , setIsWindowActionsLocked    ] = React.useState<boolean>(false);
	const [isRasterizerActionsLocked, setIsRasterizerActionsLocked] = React.useState<boolean>(false);

	return (
		<>
			
			<SearchReadFile.Component
				getMeshModel ={setMesh}
				fileExtension={"obj"}
			/>
			{/*}
			<div className={Style.DebugPanel}>
				<Debug.PolarCamera.Conponment
					camera={debugPanel}
				/>
			</div>
			*/}
			{
			<Window.Component
				resizeEnabled  = {!isWindowActionsLocked}
				moveEnabled    = {!isWindowActionsLocked}
				onStartResize  = {() => { setIsRasterizerActionsLocked(true ); }}
				onEndResize    = {() => { setIsRasterizerActionsLocked(false); }}
				onStartMove    = {() => { setIsRasterizerActionsLocked(true ); }}
				onEndMove      = {() => { setIsRasterizerActionsLocked(false); }}
				resizeSettings =
				{
					{
						offset: 10,
						left  : true,
						top   : true,
						right : true,
						bottom: false,
					}
				}
				header         = 
				{
					{
						height  : 40,
						children: <div style={{ width : "100%", height : "100%", background: "red" }}></div>
					}
				}
				window         =
				{
					{
						width : 1400,
						height: 800,
						left  : 100,
						top   : 100,
					}
				}
			>
				<RasterizerDisplay.Component
					mesh             = {mesh}
					//cameraDebug     = {setDebugPanel}
					onStartDrag      = {() => { setIsWindowActionsLocked(true ); }}
					onEndDrag        = {() => { setIsWindowActionsLocked(false); }}
					onStartRotate    = {() => { setIsWindowActionsLocked(true ); }}
					onEndRotate      = {() => { setIsWindowActionsLocked(false); }}
					zoomSettings     = 
					{
						{
							enabled  : !isRasterizerActionsLocked,
							maxRadius: 5,
							minRadius: 1,
						}
					}
					dragSettings     =
					{
						{
							enabled: !isRasterizerActionsLocked,
						}
					}
					rotateSettings   =
					{
						{
							enabled: !isRasterizerActionsLocked,
						}
					}
					keyboardSettings =
					{
						{
							enabled: true,
						}
					}
					defaultCamera    =
					{
						{
							anchor     :
							{
								x: -2.805107074079211,
								y: 6.4164063745393625,
								z: 0.4229436339504366,
							},
							polarCoord :
							{
								radius: 1.5,
								theta :  33.69999999999999,
								phi   :  24.7,
							},
						}
					}
				/>
			</Window.Component>
			}
			{/*
			<TilinWindowManager.Component>
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
			</TilinWindowManager.Component>
			*/}
		</>
	);
};

export default App;
