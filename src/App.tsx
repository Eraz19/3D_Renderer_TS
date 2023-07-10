import React from "react";

import * as Polygone       from "./Utils/Shapes/Polygone";
import * as Rasterizer     from "./Components/RasterizerDisplay";
import * as SearchReadFile from "./Components/SearchReadFile";


function App()
{
	const [mesh, setMesh] = React.useState<Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[]>([]);

	return (
		<>
			<SearchReadFile.Component
				getMeshModel ={setMesh}
				fileExtension={"obj"}
			/>
			<Rasterizer.Component
				model        ={mesh}
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
						radius:  1,
						theta : 22,
						phi   : 25,
					},
				}}
			/>
		</>
	);
};

export default App;
