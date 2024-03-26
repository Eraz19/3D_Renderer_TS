import * as ErazLib from "eraz-lib/dist";


export type T_Props =
{
	fileExtension : "obj";
	getMeshModel  : (modelMesh : ErazLib.Parser.OBJ.Types.T_OBJParsingResult) => void;
};
