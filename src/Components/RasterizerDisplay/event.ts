import * as React from "react";

import * as Types       from "./types";
import * as PolarCamera from "../../Utils/Rasterizer/PolarCamera";
import * as Vector      from "../../Utils/Vector";
import * as Matrix      from "../../Utils/Matrix";
import * as Coord       from "../../Utils/Coord";


export function ZoomCamera(
	deltaY          : number,
	camera          : PolarCamera.Types.T_PolarCamera,
	setCameraDebug  : React.Dispatch<React.SetStateAction<PolarCamera.Types.T_PolarCamera>>,
	step            : number = 0.1,
	minCameraRadius : number = 1,
) : boolean
{
	function ModifyCameraRaduis(step : number) : boolean
	{
		const newRadius : number = camera.polarCoord.radius + step;

		if (newRadius > 0)
		{
			camera.polarCoord.radius = newRadius;
			setCameraDebug((prev : PolarCamera.Types.T_PolarCamera) => { return ({...prev, polarCoord: {...prev.polarCoord, radius: newRadius } }); });

			return (true);
		}

		return (false);
	};

	if      (deltaY >= 0)                                           return (ModifyCameraRaduis(Math.abs (step)));
	else if (camera.polarCoord.radius >= Math.abs(minCameraRadius)) return (ModifyCameraRaduis(-Math.abs(step)));

	return (false);
};

export function RotateCamera(
	deltaTheta     : number,
	deltaPhi       : number,
	camera         : PolarCamera.Types.T_PolarCamera,
	setCameraDebug : React.Dispatch<React.SetStateAction<PolarCamera.Types.T_PolarCamera>>,
	step           : number = 0.1,
) : boolean
{
	function ModifyThetaAngle() : boolean
	{
		const newThetaAngle : number = ((camera.polarCoord.theta + (step * deltaTheta) % 360) + 360) % 360;

		camera.polarCoord.theta = newThetaAngle;
		setCameraDebug((prev : PolarCamera.Types.T_PolarCamera) => { return ({...prev, polarCoord: {...prev.polarCoord, theta: newThetaAngle } }); });

		return (true);
	};
	function ModifyPhiAngle() : boolean
	{
		const newPhiAngle : number = camera.polarCoord.phi + (step * deltaPhi);

		if (newPhiAngle < 89 && newPhiAngle > -89)
		{
			camera.polarCoord.phi = newPhiAngle;
			setCameraDebug((prev : PolarCamera.Types.T_PolarCamera) => { return ({...prev, polarCoord: {...prev.polarCoord, phi: newPhiAngle } }); });

			return (true);
		}
		else
			return (false);
	};

	if (deltaTheta !== 0 || deltaPhi !== 0)
	{
		const modificationThetaAngle : boolean = (deltaTheta !== 0) ? ModifyThetaAngle() : false;
		const modificationPhiAngle   : boolean = (deltaPhi   !== 0) ? ModifyPhiAngle()   : false;

		return (modificationThetaAngle || modificationPhiAngle);
	}
	else
		return (false);
};

export function DragCamera(
	deltaX         : number,
	deltaY         : number,
	camera         : Types.T_Camera,
	setCameraDebug : React.Dispatch<React.SetStateAction<PolarCamera.Types.T_PolarCamera>>,
	step           : number = 1,
) : void
{
	if (camera.cameraToWorldMatrix)
	{
		camera.anchor.x += -(deltaX * camera.cameraToWorldMatrix[1][0]) + (deltaY * camera.cameraToWorldMatrix[2][0]);
		camera.anchor.y += -(deltaX * camera.cameraToWorldMatrix[1][1]) + (deltaY * camera.cameraToWorldMatrix[2][1]);
		camera.anchor.z += -(deltaX * camera.cameraToWorldMatrix[1][2]) + (deltaY * camera.cameraToWorldMatrix[2][2]);
		setCameraDebug((prev : PolarCamera.Types.T_PolarCamera) => { return ({...prev, anchor: {...prev.anchor, x: prev.anchor.x + step } }); });
		setCameraDebug((prev : PolarCamera.Types.T_PolarCamera) => { return ({...prev, anchor: {...prev.anchor, y: prev.anchor.y + step } }); });
	}
};
