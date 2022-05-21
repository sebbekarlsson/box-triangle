import { IVector, vec3, vec3Dot, vec3Scale } from "./vector";
import { IRange } from "./range";
import { IIntersection } from "./intersection";

export const project = (vectors: IVector[], axis: IVector): IRange => {
  const r: IRange = { min: Infinity, max: -Infinity };

  for (let i = 0; i < vectors.length; i++) {
    const d = vec3Dot(axis, vectors[i]);
    r.min = Math.min(r.min, d);
    r.max = Math.max(r.max, d);
  }

  return r;
};

export const axisOverlap = (
  vectorsA: IVector[],
  vectorsB: IVector[],
  axis: IVector
): IIntersection | null => {
  let sign: number = 1;
  const range1 = project(vectorsA, axis);
  const range2 = project(vectorsB, axis);

  if (range1.min < range2.min) {
    sign = -1;
  }

  const overlap: number =
    Math.min(range1.max, range2.max) - Math.max(range1.min, range2.min);

  if (range2.min <= range1.max && range1.min <= range2.max) {
    return { penetration: overlap, sign, normal: vec3Scale(axis, sign) };
  }

  return null;
};

export const sat = (
  vectorsA: IVector[],
  vectorsB: IVector[]
): IIntersection | null => {
  let minIntersection: IIntersection = {
    sign: 1,
    penetration: Infinity,
    normal: vec3(0, 0, 0),
  };
  const axises: IVector[] = [vec3(1, 0, 0), vec3(0, 1, 0), vec3(0, 0, 1)];

  for (const axis of axises) {
    const intersection = axisOverlap(vectorsA, vectorsB, axis);
    if (!intersection) {
      return null;
    }

    if (intersection.penetration < minIntersection.penetration) {
      minIntersection = intersection;
    }
  }

  return minIntersection;
};
