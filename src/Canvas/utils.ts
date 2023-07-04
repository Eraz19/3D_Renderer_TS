import * as Point     from "eraz-lib/build/Graphic/Point";
import * as Polygone  from "eraz-lib/build/Graphic/Polygone";
import * as Line      from "eraz-lib/build/Graphic/Line";

import * as Types       from "./types";
import * as Variables   from "./variables";
import * as Pipeline    from "../Pipeline";
import * as Matrix      from "../Matrix";
import * as PolarCamera from "../Pipeline/PolarCamera";


export function PrintCoordSystem(bases:Types.T_CoordinateBases_3D):void
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

export function RenderFrame(
	canvas:React.MutableRefObject<HTMLCanvasElement|null>,
	coordinateSystemBases:Types.T_CoordinateBases_3D,
	model:Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[],
	camera:PolarCamera.Types.T_Camera,
):Types.T_CoordinateBases_3D|undefined
{
	function FromWorldSpace_ToCameraSpace_CoordSystem(
		cameraMatrix:Matrix.Types.T_Matrix_4_4,
		coordinateSystemBases:Types.T_CoordinateBases_3D,
	):Types.T_CoordinateBases_3D
	{
		//console.log("worldToCameraMatrix: \n", Matrix.Utils.PrintableMatrix(cameraMatrix));
		//PrintCoordSystem(coordinateSystemBases);

		return (
			coordinateSystemBases.map((line:Types.T_ColoredLine<Line.Types.T_Line3D>):Types.T_ColoredLine<Line.Types.T_Line3D> =>
			{
				return (
					{
						color: line.color,
						coord: line.coord.map((point:Point.Types.T_Point3D) =>
							{
								const newPoint:Point.Types.T_Point4D = Matrix.Utils.ApplyTransformation(cameraMatrix, [...point, 1]);

								return ([newPoint[0],newPoint[1],newPoint[2]]);
							}) as Line.Types.T_Line3D,
					}
				);
			}) as Types.T_CoordinateBases_3D
		);
	};

	function FromWorldSpace_ToCameraSpace_Model(
		cameraMatrix:Matrix.Types.T_Matrix_4_4,
		model:Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[],
	):Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[]
	{
		return (
			model.map((polygon:Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>):Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D> =>
			{
				return (
					{
						color: polygon.color,
						coord: polygon.coord.map((point:Point.Types.T_Point3D) =>
							{
								const newPoint:Point.Types.T_Point4D = Matrix.Utils.ApplyTransformation(cameraMatrix, [...point, 1]);

								return ([newPoint[0],newPoint[1],newPoint[2]]);
							}),
					}
				);
			})
		);
	};

	function FromCameraSpace_ToDisplaySpace(
		polygones:Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[],
		cameraRadius:number,
	):Types.T_ColoredPoint<Point.Types.T_Point2D>[]
	{
		//const cameraRadiusZoomFactor:number = 1. / cameraRadius;

		return (
			polygones.map((polygone:Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>):Types.T_ColoredPoint<Point.Types.T_Point2D>[] =>
			{
				return (
					Polygone.Utils.GetPolygonePoints(
						polygone.coord.map((point:Point.Types.T_Point3D):Point.Types.T_Point2D =>
						{
							return (Matrix.Utils.ApplyTransformation([[0,cameraRadius,0],[0,0,cameraRadius]], point));
						})
					)
					.map((point:Point.Types.T_Point2D):Types.T_ColoredPoint<Point.Types.T_Point2D> =>
					{
						return ({ color: polygone.color, coord: point });
					})
				);
			})
			.reduce((prev, current) => { return ([...prev, ...current]); }, [])
		);
	};

	if (canvas.current)
	{
		const context:CanvasRenderingContext2D|null = canvas.current.getContext("2d");

		if (context)
		{
			const cameraToWorldMatrix:Matrix.Types.T_Matrix_4_4 = PolarCamera.Utils.GenerateCamera_ToWorldMatrix(
				camera.polarCoord,
				camera.anchor,
			);
			const worldToCameraMatrix:Matrix.Types.T_Matrix_4_4 = Matrix.Utils.InverseMatrix(cameraToWorldMatrix, 4);
			const coordLine:Types.T_CoordinateBases_3D          = FromWorldSpace_ToCameraSpace_CoordSystem(
				worldToCameraMatrix,
				coordinateSystemBases
			);
			PrintCoordSystem(coordLine);
			const modelPolygones:Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[] = FromWorldSpace_ToCameraSpace_Model(
				worldToCameraMatrix,
				model,
			);

			Pipeline.DrawOnCanvas(FromCameraSpace_ToDisplaySpace([...coordLine, ...modelPolygones], camera.polarCoord[0]), context);

			return (coordLine);
		}
	}
};
