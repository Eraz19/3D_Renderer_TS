import * as React   from "react";
import * as ErazLib from "eraz-lib";


import * as Rasterizer from "./Rasterizer";


export function ZoomCamera(
	zoomFactor       : number,
	camera           : Rasterizer.Types.T_CameraState,
	minZoom          : number = 0,
	maxZoom         ?: number,
	setCameraDebug  ?: React.Dispatch<React.SetStateAction<Rasterizer.Types.T_CameraState | undefined>>,
) : boolean
{
	const newRadius : number = camera.polarCoord[2] + zoomFactor;

	if ((minZoom && newRadius > minZoom) && (maxZoom && newRadius < maxZoom))
	{
		camera.polarCoord[2] = newRadius;
		
		if (setCameraDebug)
		{
			setCameraDebug((prev : Rasterizer.Types.T_CameraState | undefined) : Rasterizer.Types.T_CameraState | undefined =>
			{
				if (prev) return ({...prev, polarCoord: [prev.polarCoord[0],prev.polarCoord[1],newRadius] });
				else      return (undefined);
			});
		}

		return (true);
	}

	return (false);
};

export function RotateCamera(
	deltaTheta      : number,
	deltaPhi        : number,
	camera          : Rasterizer.Types.T_CameraState,
	setCameraDebug ?: React.Dispatch<React.SetStateAction<Rasterizer.Types.T_CameraState | undefined>>,
) : boolean
{
	function ModifyThetaAngle() : boolean
	{
		const newThetaAngle : number = ((camera.polarCoord[1] + deltaTheta % 360) + 360) % 360;

		camera.polarCoord[1] = newThetaAngle;

		if (setCameraDebug)
		{
			setCameraDebug((prev : Rasterizer.Types.T_CameraState | undefined) : Rasterizer.Types.T_CameraState | undefined =>
			{
				if (prev) return ({...prev, polarCoord: [prev.polarCoord[0],newThetaAngle,prev.polarCoord[2]] });
				else      return (undefined);
			});
		}

		return (true);
	};

	function ModifyPhiAngle() : boolean
	{
		const newPhiAngle : number = camera.polarCoord[0] + deltaPhi;

		if (newPhiAngle < 89 && newPhiAngle > -89)
		{
			camera.polarCoord[0] = newPhiAngle;

			if (setCameraDebug)
			{
				setCameraDebug((prev : Rasterizer.Types.T_CameraState | undefined) : Rasterizer.Types.T_CameraState | undefined =>
				{
					if (prev) return ({...prev, polarCoord: [newPhiAngle,prev.polarCoord[1],prev.polarCoord[2]] });
					else      return (undefined);
				});
			}

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
	deltaX          : number,
	deltaY          : number,
	camera          : Rasterizer.Types.T_CameraState,
	setCameraDebug ?: React.Dispatch<React.SetStateAction<Rasterizer.Types.T_CameraState | undefined>>,
) : void
{
	if (camera.cameraToSideVector && camera.cameraToTopVector)
	{
		const addCameraToSideVectorToAnchorCoord : ErazLib.Graphic.Vector.Types.T_Vec3D = ErazLib.Graphic.Vector.Utils.Add(
				camera.anchor,
				ErazLib.Graphic.Vector.Utils.Scale(camera.cameraToSideVector, deltaX)
			);
		const addCameraToTopVectorToAnchorCoord  : ErazLib.Graphic.Vector.Types.T_Vec3D = ErazLib.Graphic.Vector.Utils.Add(
				addCameraToSideVectorToAnchorCoord,
				ErazLib.Graphic.Vector.Utils.Scale(camera.cameraToTopVector , deltaY)
			);

		camera.anchor = addCameraToTopVectorToAnchorCoord;

		if (setCameraDebug)
		{
			setCameraDebug((prev : Rasterizer.Types.T_CameraState | undefined) : Rasterizer.Types.T_CameraState | undefined =>
			{
				if (prev) return ({...prev, anchor: addCameraToTopVectorToAnchorCoord });
				else      return (undefined);
			});
		}
	}
};
