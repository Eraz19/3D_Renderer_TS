import * as React from "react";
import * as ErazLib from "eraz-lib";


import * as Types from "./types";
import * as Utils from "./utils";
import      Style from "./styles.module.scss";


export const Component = (props:Types.T_Props) =>
{
	const ref = React.useRef<HTMLInputElement>(null);

	const [fileName, setFileName] = React.useState<string>("");

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

						Utils
						.ReadOBJFile(e.target.files[0])
						.then((parsedOBJ : ErazLib.Parser.OBJ.Types.T_OBJParsingResult | undefined) =>
						{
							if (parsedOBJ)
								props.getMeshModel(parsedOBJ);
						})
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

export * as Utils from "./utils";
