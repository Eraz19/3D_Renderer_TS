


/*export function PrintCoordSystem(bases:Types.T_CoordinateBases_3D):void
{
	let result:string = bases.map((base:Types.T_ColoredLine<Line.Types.T_Line3D>, index:number):string =>
		{
			let lineName:string =
				(index === 0)
				?	"x"
				:	(index === 1)
					?	"y"
					:	"z"

			return (lineName +" "+ base.coord.join("  "));
		})
		.join("\n");

	console.log(result);
};

export function PrintableMatrix(matrix:number[][]):string
{
	return (matrix.join("\n"));
};*/
