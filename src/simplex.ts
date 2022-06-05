import { IVector } from "./vector";

export enum ESimplexWinding {
    CLOCKWISE,
    COUNTER_CLOCKWISE
}

export interface ISimplex {
    vertices: IVector[];
    winding?: ESimplexWinding;
    sumDir?: IVector;
}
