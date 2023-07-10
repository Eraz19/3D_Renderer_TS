type T_Props =
{
	mode:"translation"|"rotation";
	x:number;
	y:number;
	z:number;
	radius:number;
	thetaAngle:number;
	phiAngle:number;
};

export const Conponment = (props:T_Props) =>
{
	return (
		<table>
			<tbody>
				<tr><th>Mode</th></tr>
				<tr><td>{props.mode}</td></tr>

				<tr><th>Anchor</th></tr>
				<tr><td>x</td><td>{props.x}</td></tr>
				<tr><td>y</td><td>{props.y}</td></tr>
				<tr><td>z</td><td>{props.z}</td></tr>

				<tr><th>Camera</th></tr>
				<tr><td>Raduis </td><td>{props.radius.toFixed(2)}    </td></tr>
				<tr><td>&theta;</td><td>{props.thetaAngle.toFixed(2)}</td></tr>
				<tr><td>&phi;  </td><td>{props.phiAngle.toFixed(2)}  </td></tr>
			</tbody>
		</table>
	);
};
