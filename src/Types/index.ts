type CreateArrayWithLengthX<
    LENGTH extends number,
    ACC    extends unknown[] = [],
> = ACC['length'] extends LENGTH
    ?   ACC
    :   CreateArrayWithLengthX<LENGTH, [...ACC,1]>
;

type T_NumericRange<
   START_ARR extends number[], 
   END       extends number, 
   ACC       extends number = never
> = START_ARR['length'] extends END 
   ?    ACC | END
   :    T_NumericRange<[...START_ARR,1], END, ACC | START_ARR['length']>
;

export type T_Range<START extends number, END extends number> = T_NumericRange<CreateArrayWithLengthX<START>,END>;

export * as Style from "./style";
export * as Time  from "./time";