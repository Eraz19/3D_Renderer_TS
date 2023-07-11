import * as PolarCamera from "../../Utils/Rasterizer/PolarCamera";
import * as Polygone    from "../../Utils/Shapes/Polygone";


export type T_Props =
{
	defaultCamera:PolarCamera.Types.T_PolarCamera;
	mesh:Polygone.Types.T_ColoredPolygone<Polygone.Types.T_Polygone3D>[];
	cameraDebug:(debug:PolarCamera.Types.T_PolarCamera) => void;
};

export type T_EventCameraCallback<T> = (
	e:T,
	camera:PolarCamera.Types.T_PolarCamera,
	setCameraDebug:React.Dispatch<React.SetStateAction<PolarCamera.Types.T_PolarCamera>>,
) => boolean
