import React from "react";

import * as Polygone          from "./Utils/Shapes/Polygone";
import * as PolarCamera       from "./Utils/Rasterizer/PolarCamera";
import * as RasterizerDisplay from "./Components/RasterizerDisplay";
import * as SearchReadFile    from "./Components/SearchReadFile";
import * as Debug             from "./Components/Debug";
import      Style             from "./style.module.scss";


function App()
{
	const [mesh      , setMesh      ] = React.useState<Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[]>([]);
	const [debugPanel, setDebugPanel] = React.useState<PolarCamera.Types.T_PolarCamera>();

	return (
		<>
			<SearchReadFile.Component
				getMeshModel ={setMesh}
				fileExtension={"obj"}
			/>
			<RasterizerDisplay.Component
				mesh         ={mesh}
				cameraDebug  ={(cameraDebug:PolarCamera.Types.T_PolarCamera) =>
				{
					setDebugPanel(cameraDebug);
				}}
				defaultCamera=
				{{
					eventTarger: "anchor",
					anchor:
					{
						x: 0,
						y: 0,
						z: 0,
					},
					polarCoord:
					{
						radius: 1.5,
						theta :  22,
						phi   :  25,
					},
				}}
			/>
			<div className={Style.DebugPanel}>
				<Debug.PolarCamera.Conponment
					camera={debugPanel}
				/>
			</div>
		</>
	);
};

export default App;
