import { ESimplexWinding, ISimplex } from "./simplex";
import { IVector, vec3 } from "./vector";

export interface IGJKData {
  support: IVector;
  dir: IVector;
}

export interface IGJK {
  intersects: boolean;
  simplex: ISimplex;
  dir: IVector;
}

export const GJK_DEFAULT: IGJK = {
  intersects: false,
  simplex: { vertices: [], winding: ESimplexWinding.CLOCKWISE },
  dir: vec3(0.0, 0.0, 0.0),
};

export interface IEdge {
    distance: number;
    normal: IVector;
    index: number;
}
