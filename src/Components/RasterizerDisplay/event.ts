import * as ErazLib from "eraz-lib";


import * as Rasterizer from "./Rasterizer";


export function ZoomCamera(
	zoomFactor  : number,
	camera      : Rasterizer.Types.T_CameraState,
	minZoom     : number = 0,
	maxZoom    ?: number,
) : boolean
{
	const newRadius : number = camera.polarCoord[2] + zoomFactor;

	if ((minZoom && newRadius > minZoom) && (maxZoom && newRadius < maxZoom))
	{
		camera.polarCoord[2] = newRadius;
	
		return (true);
	}

	return (false);
};

export function RotateCamera(
	deltaTheta : number,
	deltaPhi   : number,
	camera     : Rasterizer.Types.T_CameraState,
) : boolean
{
	function ModifyThetaAngle() : boolean
	{
		const newThetaAngle : number = ((camera.polarCoord[1] + deltaTheta % 360) + 360) % 360;

		camera.polarCoord[1] = newThetaAngle;

		return (true);
	};

	function ModifyPhiAngle() : boolean
	{
		const newPhiAngle : number = camera.polarCoord[0] + deltaPhi;

		if (newPhiAngle < 89 && newPhiAngle > -89)
		{
			camera.polarCoord[0] = newPhiAngle;

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
	deltaX : number,
	deltaY : number,
	camera : Rasterizer.Types.T_CameraState,
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
	}
};
