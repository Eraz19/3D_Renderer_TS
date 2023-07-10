import * as Vector from "../../../Utils/Vector";
import * as Coord  from "../../../Utils/Coord";
import * as Matrix from "../../../Utils/Matrix";
import * as Types  from "./types";


export function FromCartesian_ToPolar(coord : Coord.Types.T_Coord3D): Types.T_PolarCoordSystem
{
	return (
		{
			radius: Math.sqrt(coord.x * coord.x + coord.y * coord.y + coord.z * coord.z),
			theta : Math.atan(coord.y / coord.x),
			phi   : Math.atan(coord.z / (Math.sqrt(coord.x * coord.x + coord.y * coord.y))),
		}
	);
};

export function FromPolar_ToCartesian(coord : Types.T_PolarCoordSystem) : Vector.Types.T_Vec3D
{
	function FromDegree_ToRadian(degree : number): number { return (degree * (Math.PI / 180)); };

	const radius           : number = coord.radius;
	const thetaInRadian    : number = FromDegree_ToRadian(coord.theta);
	const phiInRadian      : number = FromDegree_ToRadian(coord.phi);
	const projectionXYNorm : number = radius * Math.cos(phiInRadian);

	return (
		[
			projectionXYNorm * Math.cos(thetaInRadian),
			projectionXYNorm * Math.sin(thetaInRadian),
			radius           * Math.sin(phiInRadian),
		]
	);
};

export function GenerateCamera_ToWorldMatrix(camera : Types.T_PolarCamera): Matrix.Types.T_Matrix_4_4
{
	const vectorFromAnchorToCamera : Vector.Types.T_Vec3D = FromPolar_ToCartesian(camera.polarCoord);
	const cameraSpaceX             : Vector.Types.T_Vec3D = Vector.Utils.Normalize(Vector.Utils.Inverse(vectorFromAnchorToCamera));
	const cameraSpaceY             : Vector.Types.T_Vec3D = Vector.Utils.Normalize(Vector.Utils.CrossProduct(cameraSpaceX, [0,0,1]));
	const cameraSpaceZ             : Vector.Types.T_Vec3D = Vector.Utils.Normalize(Vector.Utils.CrossProduct(cameraSpaceY, cameraSpaceX));
	const cameraCoord              : Vector.Types.T_Vec3D = Vector.Utils.Add(Coord.Utils.FromCoord_ToVec({ x: camera.anchor.x, y: camera.anchor.y, z: camera.anchor.z }), vectorFromAnchorToCamera);

	return (
		[
			[cameraSpaceX[0],cameraSpaceY[0],cameraSpaceZ[0],cameraCoord[0]],
			[cameraSpaceX[1],cameraSpaceY[1],cameraSpaceZ[1],cameraCoord[1]],
			[cameraSpaceX[2],cameraSpaceY[2],cameraSpaceZ[2],cameraCoord[2]],
			[              0,              0,              0,             1],
		]
	);
};
