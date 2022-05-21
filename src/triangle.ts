import { IVector, vec3Add } from "./vector";
import { IBox, getBoxVectors } from "./box";
import { sat } from "./sat";
import { IIntersection } from "./intersection";

export interface ITriangle {
  v1: IVector;
  v2: IVector;
  v3: IVector;
}

export const translateTriangle = (
  triangle: ITriangle,
  pos: IVector
): ITriangle => ({
  v1: vec3Add(triangle.v1, pos),
  v2: vec3Add(triangle.v2, pos),
  v3: vec3Add(triangle.v3, pos),
});

export const triangleBoxIntersection = (
  triangle: ITriangle,
  box: IBox
): IIntersection | undefined =>
  sat([triangle.v1, triangle.v2, triangle.v3], getBoxVectors(box));
