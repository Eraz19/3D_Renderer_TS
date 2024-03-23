import * as ParserOBJ from "../../Utils/Parser/OBJ";


export type T_Props =
{
	fileExtension : "obj";
	getMeshModel  : (modelMesh:ParserOBJ.Types.T_OBJParsingResult) => void;
};
