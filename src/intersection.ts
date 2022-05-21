import { IVector } from "./vector";

export interface IIntersection {
  penetration: number;
  sign: number;
  normal: IVector;
}
