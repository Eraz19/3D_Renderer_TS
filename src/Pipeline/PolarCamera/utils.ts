import * as Point  from "eraz-lib/build/Graphic/Point";
import * as Vector from "eraz-lib/build/Graphic/Vector";

import * as Types       from "./types";
import * as Matrix      from "../../Matrix";
import * as VectorLocal from "../../Vector";


export function FromCartesian_ToPolar(coord:Types.T_CartesianCoordSystem):Types.T_PolarCoordSystem
{
	const x:number = Point.Utils.GetX(coord);
	const y:number = Point.Utils.GetY(coord);
	const z:number = Point.Utils.GetZ(coord);

	return (
		[
			Math.sqrt(x * x + y * y + z * z),
			Math.atan(y / x),
			Math.atan(z / (Math.sqrt(x * x + y * y))),
		]
	);
};

export function FromPolar_ToCartesian(coord:Types.T_PolarCoordSystem):Types.T_CartesianCoordSystem
{
	function FromDegree_ToRadian(degree:number):number { return (degree * (Math.PI / 180)); };

	const radius        : number = coord[0];
	const thetaInRadian : number = FromDegree_ToRadian(coord[1]);
	const phiInRadian   : number = FromDegree_ToRadian(coord[2]);

	const projectionXYNorm:number = radius * Math.cos(phiInRadian);

	return (
		[
			projectionXYNorm * Math.cos(thetaInRadian),
			projectionXYNorm * Math.sin(thetaInRadian),
			radius           * Math.sin(phiInRadian),
		]
	);
};

export function NormalizeVector(vector:Vector.Types.T_3D):Vector.Types.T_3D
{
	const x:number = Point.Utils.GetX(vector);
	const y:number = Point.Utils.GetY(vector);
	const z:number = Point.Utils.GetZ(vector);

	const factor:number = 1. / VectorLocal.Utils.VectorNorm(vector);

	return ([x * factor, y * factor, z * factor]);
};

export function CrossProduct(vector1:Vector.Types.T_3D, vector2:Vector.Types.T_3D):Vector.Types.T_3D
{
	const x1:number = Point.Utils.GetX(vector1);
	const y1:number = Point.Utils.GetY(vector1);
	const z1:number = Point.Utils.GetZ(vector1);
	const x2:number = Point.Utils.GetX(vector2);
	const y2:number = Point.Utils.GetY(vector2);
	const z2:number = Point.Utils.GetZ(vector2);

	return (
		[
			(y1 * z2) - (y2 * z1),
			(z1 * x2) - (z2 * x1),
			(x1 * y2) - (x2 * y1),
		]
	);
};

export function GenerateCamera_ToWorldMatrix(
	cameraPolarCoord:Types.T_PolarCoordSystem,
	anchorCoord:Types.T_CartesianCoordSystem,
):Matrix.Types.T_Matrix_4_4
{
	const vectorFromAnchorToCamera:Vector.Types.T_3D = FromPolar_ToCartesian(cameraPolarCoord);

	console.log("vectorFromAnchorToCamera: ", vectorFromAnchorToCamera);

	const cameraSpaceX:Vector.Types.T_3D = NormalizeVector(VectorLocal.Utils.InverseVector(vectorFromAnchorToCamera));
	console.log("cameraSpaceX: ", cameraSpaceX);
	const cameraSpaceY:Vector.Types.T_3D = NormalizeVector(CrossProduct(cameraSpaceX, [0,0,1]));
	console.log("cameraSpaceY: ", cameraSpaceY);
	const cameraSpaceZ:Vector.Types.T_3D = NormalizeVector(CrossProduct(cameraSpaceY, cameraSpaceX));
	console.log("cameraSpaceZ: ", cameraSpaceZ);

	const cameraCoord:Vector.Types.T_3D  = VectorLocal.Utils.Add(anchorCoord, vectorFromAnchorToCamera);

	const result:Matrix.Types.T_Matrix_4_4 =
	[
		[cameraSpaceX[0],cameraSpaceY[0],cameraSpaceZ[0],cameraCoord[0]],
		[cameraSpaceX[1],cameraSpaceY[1],cameraSpaceZ[1],cameraCoord[1]],
		[cameraSpaceX[2],cameraSpaceY[2],cameraSpaceZ[2],cameraCoord[2]],
		[              0,              0,              0,             1],
	];

	console.log("result: ", result);

	return (result);
};
