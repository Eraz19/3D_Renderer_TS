import * as React from "react";


import * as Coord  from "../../Utils/Coord";
import * as Vector from "../../Utils/Vector";

import * as UIRasterizerTypes from "./Rasterizer/types";


export function ZoomCamera(
	zoomFactor       : number,
	camera           : UIRasterizerTypes.T_CameraState,
	minZoom          : number = 0,
	maxZoom         ?: number,
	setCameraDebug  ?: React.Dispatch<React.SetStateAction<UIRasterizerTypes.T_CameraState | undefined>>,
) : boolean
{
	const newRadius : number = camera.polarCoord.radius + zoomFactor;

	if ((minZoom && newRadius > minZoom) && (maxZoom && newRadius < maxZoom))
	{
		camera.polarCoord.radius = newRadius;
		
		if (setCameraDebug)
		{
			setCameraDebug((prev : UIRasterizerTypes.T_CameraState | undefined) : UIRasterizerTypes.T_CameraState | undefined =>
			{
				if (prev) return ({...prev, polarCoord: {...prev.polarCoord, radius: newRadius } });
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
	camera          : UIRasterizerTypes.T_CameraState,
	setCameraDebug ?: React.Dispatch<React.SetStateAction<UIRasterizerTypes.T_CameraState | undefined>>,
) : boolean
{
	function ModifyThetaAngle() : boolean
	{
		const newThetaAngle : number = ((camera.polarCoord.theta + deltaTheta % 360) + 360) % 360;

		camera.polarCoord.theta = newThetaAngle;

		if (setCameraDebug)
		{
			setCameraDebug((prev : UIRasterizerTypes.T_CameraState | undefined) : UIRasterizerTypes.T_CameraState | undefined =>
			{
				if (prev) return ({...prev, polarCoord: {...prev.polarCoord, theta: newThetaAngle } });
				else      return (undefined);
			});
		}

		return (true);
	};

	function ModifyPhiAngle() : boolean
	{
		const newPhiAngle : number = camera.polarCoord.phi + deltaPhi;

		if (newPhiAngle < 89 && newPhiAngle > -89)
		{
			camera.polarCoord.phi = newPhiAngle;

			if (setCameraDebug)
			{
				setCameraDebug((prev : UIRasterizerTypes.T_CameraState | undefined) : UIRasterizerTypes.T_CameraState | undefined =>
				{
					if (prev) return ({...prev, polarCoord: {...prev.polarCoord, phi: newPhiAngle } });
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
	camera          : UIRasterizerTypes.T_CameraState,
	setCameraDebug ?: React.Dispatch<React.SetStateAction<UIRasterizerTypes.T_CameraState | undefined>>,
) : void
{
	if (camera.cameraToSideVector && camera.cameraToTopVector)
	{
		const addCameraToSideVectorToAnchorCoord : Coord.Types.T_Coord3D = Coord.Utils.Add(camera.anchor                     , Vector.Utils.Scale(camera.cameraToSideVector, deltaX));
		const addCameraToTopVectorToAnchorCoord  : Coord.Types.T_Coord3D = Coord.Utils.Add(addCameraToSideVectorToAnchorCoord, Vector.Utils.Scale(camera.cameraToTopVector , deltaY));

		camera.anchor = addCameraToTopVectorToAnchorCoord;

		if (setCameraDebug)
		{
			setCameraDebug((prev : UIRasterizerTypes.T_CameraState | undefined) : UIRasterizerTypes.T_CameraState | undefined =>
			{
				if (prev) return ({...prev, anchor: addCameraToTopVectorToAnchorCoord });
				else      return (undefined);
			});
		}
	}
};
