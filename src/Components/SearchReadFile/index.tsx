import * as Polygone  from "eraz-lib/build/Graphic/Polygone";

import * as Canvas from "../RasterizerDisplay";
import * as Utils  from "../../Utils";


type T_Props =
{
	getMeshModel:(modelMesh:Canvas.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[]) => void;
	fileExtension:"obj";
};

export const Component = (props:T_Props) =>
{
	function ReadContentOnLoad(fileReader:FileReader):void
	{
		const fileContent:string|ArrayBuffer|null = fileReader.result;

		if (typeof fileContent === "string")
			props.getMeshModel(Canvas.Utils.FromPolygones3D_ToColoredPolygones3D(Utils.Parser.OBJ.ParseOBJFile(fileContent)));
	};

	function ReadOBJFile(file:File):void
	{
		const fileReader:FileReader = new FileReader();

		fileReader.readAsText(file);
		fileReader.onload = ():void => { ReadContentOnLoad(fileReader); };	
	};

	return (
		<input
			type    ={"file"}
			accept  ={props.fileExtension}
			onChange={(e:React.ChangeEvent<HTMLInputElement>) =>
			{
				if (e.target.files)
					ReadOBJFile(e.target.files[0]);
			}}
		/>
	);
};
