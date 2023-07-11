import * as PolarCamera from "../../Utils/Rasterizer/PolarCamera";


export function ChangeCameraMode(
	e              : KeyboardEvent,
	camera         : PolarCamera.Types.T_PolarCamera,
	setCameraDebug : React.Dispatch<React.SetStateAction<PolarCamera.Types.T_PolarCamera>>,
) : boolean
{
	if (e.key === 'a')
	{
		camera.eventTarger = "anchor";
		setCameraDebug((prev : PolarCamera.Types.T_PolarCamera) => { return ({...prev, eventTarger: "anchor" }); });
		return (true);
	}
	else if (e.key === 'c')
	{
		camera.eventTarger = "camera";
		setCameraDebug((prev : PolarCamera.Types.T_PolarCamera) => { return ({...prev, eventTarger: "camera" }); });
		return (true);
	}

	return (false);
};

export function ZoomCamera(
	e              : WheelEvent,
	camera         : PolarCamera.Types.T_PolarCamera,
	setCameraDebug : React.Dispatch<React.SetStateAction<PolarCamera.Types.T_PolarCamera>>,
) : boolean
{
	function ModifyCameraRaduis(step : .1|-.1) : boolean
	{
		const newRadius : number = camera.polarCoord.radius + step;

		if (newRadius > 0)
		{
			camera.polarCoord.radius = newRadius;
			setCameraDebug((prev : PolarCamera.Types.T_PolarCamera) =>
			{
				return ({...prev, polarCoord: {...prev.polarCoord, radius: newRadius } });
			});
			return (true);
		}

		return (false);
	};

	if (camera.eventTarger === "camera")
	{
		if      (e.deltaY >= 0)                 return (ModifyCameraRaduis( .1));
		else if (camera.polarCoord.radius >= 1) return (ModifyCameraRaduis(-.1));
	}

	return (false);
};

export function RotateCamera(
	e              : KeyboardEvent,
	camera         : PolarCamera.Types.T_PolarCamera,
	setCameraDebug : React.Dispatch<React.SetStateAction<PolarCamera.Types.T_PolarCamera>>,
) : boolean
{
	function ModifyCameraAngle(
		step  : 1|-1,
		angle : "theta"|"phi",
	) : void
	{
		function ModifyThetaAngle() : void
		{
			const newThetaAngle : number = ((camera.polarCoord.theta + step % 360) + 360) % 360;

			camera.polarCoord.theta = newThetaAngle;
			setCameraDebug((prev : PolarCamera.Types.T_PolarCamera) =>
			{
				return ({...prev, polarCoord: {...prev.polarCoord, theta: newThetaAngle } });
			});
		};
		function ModifyPhiAngle() : void
		{
			const newPhiAngle : number = camera.polarCoord.phi + step;

			if (newPhiAngle < 89 && newPhiAngle > -89)
			{
				camera.polarCoord.phi = newPhiAngle;
				setCameraDebug((prev : PolarCamera.Types.T_PolarCamera) =>
				{
					return ({...prev, polarCoord: {...prev.polarCoord, phi: newPhiAngle } });
				});
			}
		};

		if      (angle === "theta") ModifyThetaAngle();
		else if (angle === "phi")   ModifyPhiAngle();
	};

	switch (e.key)
	{
		case "ArrowRight":
			ModifyCameraAngle(1, "theta");
			return (true);
		case "ArrowLeft":
			ModifyCameraAngle(-1, "theta");
			return (true);
		case "ArrowUp":
			ModifyCameraAngle(1, "phi");
			return (true);
		case "ArrowDown":
			ModifyCameraAngle(-1, "phi");
			return (true);
		default:
			return (false);
	}
};

export function DragCamera(
	e              : KeyboardEvent,
	camera         : PolarCamera.Types.T_PolarCamera,
	setCameraDebug : React.Dispatch<React.SetStateAction<PolarCamera.Types.T_PolarCamera>>,
) : boolean
{
	function ModifyAnchor(
		step : 1|-1,
		axis : "x"|"y"|"z",
	) : void
	{
		function ModifyAnchorXAxis() : void
		{
			camera.anchor.x += step;
			setCameraDebug((prev : PolarCamera.Types.T_PolarCamera) =>
			{
				return ({...prev, anchor: {...prev.anchor, x: prev.anchor.x + step } });
			});
		};
		function ModifyAnchorYAxis() : void
		{
			camera.anchor.y += step;
			setCameraDebug((prev : PolarCamera.Types.T_PolarCamera) =>
			{
				return ({...prev, anchor: {...prev.anchor, y: prev.anchor.y + step } });
			});
		};
		function ModifyAnchorZAxis() : void
		{
			camera.anchor.z += step;
			setCameraDebug((prev : PolarCamera.Types.T_PolarCamera) =>
			{
				return ({...prev, anchor: {...prev.anchor, z: prev.anchor.z + step } });
			});
		};

		if      (axis === "x") ModifyAnchorXAxis();
		else if (axis === "y") ModifyAnchorYAxis();
		else if (axis === "z") ModifyAnchorZAxis();
	};

	switch (e.key)
	{
		case "ArrowRight":
			ModifyAnchor( 1, "y");
			return (true);
		case "ArrowLeft":
			ModifyAnchor(-1, "y");
			return (true);
		case "ArrowUp":
			if (e.ctrlKey) ModifyAnchor(1, "x");
			else           ModifyAnchor(1, "z");
			return (true);
		case "ArrowDown":
			if (e.ctrlKey) ModifyAnchor(-1, "x");
			else           ModifyAnchor(-1, "z");
			return (true);
		default:
			return (false);
	}
};
