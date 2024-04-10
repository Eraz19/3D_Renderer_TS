import * as Types from ".";


export type T_Year = number;

export type T_Month = Types.T_Range<1,12>;

export type T_DayOfWeekNumeric = Types.T_Range<1,7>;
//	- "dddd" will format the date day part by a day of the week's full name
//	- "ddd"  will format the date day part by a day of the week's abbreviated name with three letters
//	- "d"    will format the date day part by a day of the week's first letter
export type T_DayOfWeekFormat = "dddd" | "ddd" | "d" ;

export type T_Hour = Types.T_Range<0,23>;
//	- "24" will format the hour on a 24 hour clock,
//	- "am" will format the hour on a 12 hour clock with the am/pm indicatot in lower case
//	- "AM" will format the hour on a 12 hour clock with the am/pm indicatot in upper case
export type T_HourFormat = "am" | "AM" | "24";

export type T_Minute = Types.T_Range<0,59>;

export type T_Second = Types.T_Range<0,59>;
