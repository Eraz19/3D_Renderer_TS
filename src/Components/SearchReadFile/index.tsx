import React from "react";

import * as ParserOBJ from "../../Utils/Parser/OBJ";
import * as Types     from "./types";
import      Style     from "./styles.module.scss";


export const Component = (props:Types.T_Props) =>
{
	const ref = React.useRef<HTMLInputElement>(null);

	const [fileName, setFileName] = React.useState<string>("");

	function ReadOBJFile(file:File):void
	{
		function ReadContentOnLoad(fileReader:FileReader):void
		{
			const fileContent:string|ArrayBuffer|null = fileReader.result;
	
			if (typeof fileContent === "string")
				props.getMeshModel(ParserOBJ.ParseOBJFile(fileContent));
		};

		const fileReader:FileReader = new FileReader();

		fileReader.readAsText(file);
		fileReader.onload = ():void =>
		{
			ReadContentOnLoad(fileReader);
		};	
	};

	return (
		<div className={Style.Container}>
			<input
				ref      = {ref}
				type     = {"file"}
				hidden   = {true}
				accept   = {props.fileExtension}
				onChange = {(e:React.ChangeEvent<HTMLInputElement>) =>
				{
					if (e.target.files && e.target.files.length != 0)
					{
						setFileName(e.target.files[0].name);
						ReadOBJFile(e.target.files[0]);
					}
				}}
			/>
			<button
				className = {Style.BrowseButton}
				onClick   = {() =>
				{
					if (ref.current)
						ref.current.click();
				}}
			>
				Browse File
			</button>
			<div className={Style.FileName}>
				<div>{fileName}</div>
			</div>
		</div>
	);
};
