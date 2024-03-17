import * as Types from "./types";
import      Style from "./style.module.scss";


export const Conponment = (props:Types.T_Props) =>
{
	return (
		<table className={Style.Table}>
			<tbody>
				<tr><th colSpan={2}>Mode</th></tr>
				<tr><td colSpan={2}>{(props.camera) ? props.camera.action : '-'}</td></tr>

				<tr><th colSpan={2}>Anchor</th></tr>
				<tr><td>x</td><td>{(props.camera) ? props.camera.anchor.x : '-'}</td></tr>
				<tr><td>y</td><td>{(props.camera) ? props.camera.anchor.y : '-'}</td></tr>
				<tr><td>z</td><td>{(props.camera) ? props.camera.anchor.z : '-'}</td></tr>

				<tr><th colSpan={2}>Camera</th></tr>
				<tr><td>&theta;</td><td>{(props.camera) ? props.camera.polarCoord.theta .toFixed(2) : '-'}</td></tr>
				<tr><td>Raduis </td><td>{(props.camera) ? props.camera.polarCoord.radius.toFixed(2) : '-'}</td></tr>
				<tr><td>&phi;  </td><td>{(props.camera) ? props.camera.polarCoord.phi   .toFixed(2) : '-'}</td></tr>
			</tbody>
		</table>
	);
};
