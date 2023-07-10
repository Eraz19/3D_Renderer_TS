import * as Primitive from "eraz-lib/build/Primitive";


export type T_Value  = Primitive.Number.Types.T_Range<0,255>;
export type T_String = `rgb(${number},${number},${number})`;
export type T_Color  =
{
	red:T_Value;
	green:T_Value;
	blue:T_Value;
};
