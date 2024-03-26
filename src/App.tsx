import * as React   from "react";
import * as ErazLib from "eraz-lib/dist";


import * as Window             from "./Components/Window";
import * as TilinWindowManager from "./Components/TilingWindowManager";
import * as RasterizerDisplay  from "./Components/RasterizerDisplay";
import * as SearchReadFile     from "./Components/SearchReadFile";
import      Style              from "./style.module.scss";


function App() : JSX.Element
{
	const [mesh, setMesh] = React.useState<ErazLib.Parser.OBJ.Types.T_OBJParsingResult>({ vertices: [], edges: [] });

	const [isWindowActionsLocked    , setIsWindowActionsLocked    ] = React.useState<boolean>(false);
	const [isRasterizerActionsLocked, setIsRasterizerActionsLocked] = React.useState<boolean>(false);

	return (
		<>
			
			<SearchReadFile.Component
				getMeshModel  = {setMesh}
				fileExtension = {"obj"}
			/>
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
						mesh             =
						{
							{
								vertices: mesh.vertices,
								edges   : mesh.edges.map((edge : ErazLib.Parser.OBJ.Types.T_Edge) =>
								{
									return (
										{
											edge : edge,
											color: { red: 0, green: 0, blue: 0 },
										}
									);
								})
							}
						}
						onStartDrag      = {() => { setIsWindowActionsLocked(true ); }}
						onEndDrag        = {() => { setIsWindowActionsLocked(false); }}
						onStartRotate    = {() => { setIsWindowActionsLocked(true ); }}
						onEndRotate      = {() => { setIsWindowActionsLocked(false); }}
						zoomSettings     = 
						{
							{
								enabled  : !isRasterizerActionsLocked,
								maxRadius: 5,
								minRadius: 0.5,
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
								anchor     : [0 ,0 ,0  ],
								polarCoord : [22,25,1.5]
							}
						}
					/>
				</Window.Component>
			}
		</>
	);
};


export default App;
