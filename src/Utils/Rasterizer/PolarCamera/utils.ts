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
	const cameraToAnchorVector     : Vector.Types.T_Vec3D = Vector.Utils.Normalize(Vector.Utils.Inverse(vectorFromAnchorToCamera));
	const cameraToSideVector       : Vector.Types.T_Vec3D = Vector.Utils.Normalize(Vector.Utils.CrossProduct(cameraToAnchorVector, [0,0,1]));
	const cameraToTopVector        : Vector.Types.T_Vec3D = Vector.Utils.Normalize(Vector.Utils.CrossProduct(cameraToSideVector, cameraToAnchorVector));
	const cameraCoord              : Vector.Types.T_Vec3D = Vector.Utils.Add([camera.anchor.x,camera.anchor.y,camera.anchor.z], vectorFromAnchorToCamera);

	return (
		[
			[cameraToAnchorVector[0],cameraToSideVector[0],cameraToTopVector[0],cameraCoord[0]],
			[cameraToAnchorVector[1],cameraToSideVector[1],cameraToTopVector[1],cameraCoord[1]],
			[cameraToAnchorVector[2],cameraToSideVector[2],cameraToTopVector[2],cameraCoord[2]],
			[                      0,                    0,                   0,             1],
		]
	);
};

export function IsEqual(
	polarCamera1 : Types.T_PolarCoordSystem,
	polarCamera2 : Types.T_PolarCoordSystem,
) : boolean
{
	return (polarCamera1.phi === polarCamera2.phi && polarCamera1.radius === polarCamera2.radius && polarCamera1.theta === polarCamera2.theta);
};

export function DeepCopy(camera : Types.T_PolarCamera) : Types.T_PolarCamera
{
	return (
		{
			anchor    : { x     : camera.anchor.x        , y  : camera.anchor.y      , z     : camera.anchor.z          },
    		polarCoord: { theta : camera.polarCoord.theta, phi: camera.polarCoord.phi, radius: camera.polarCoord.radius },
		}
	);
};
