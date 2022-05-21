import { IVector, vec3, vec3Dot, vec3Scale, vec3Sub, vec3Unit } from "./vector";
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

const _sat = (
  vectorsA: IVector[],
  vectorsB: IVector[]
): IIntersection | null => {
  let minIntersection: IIntersection | null = null;
  const axises: IVector[] = [];

  for (let i = 0; i < vectorsA.length; i++) {
    const v1 = vectorsA[i];
    const v2 = vectorsA[(i + 1) % vectorsA.length];
    const edge = vec3Sub(v1, v2);
    const axis = vec3Unit(edge);
    axises.push(axis);
  }

  for (let i = 0; i < vectorsB.length; i++) {
    const v1 = vectorsB[i];
    const v2 = vectorsB[(i + 1) % vectorsB.length];
    const edge = vec3Sub(v1, v2);
    const axis = vec3Unit(edge);
    axises.push(axis);
  }

  for (const axis of axises) {
    const intersection = axisOverlap(vectorsA, vectorsB, axis);
    if (!intersection) {
      return null;
    }

    if (
      minIntersection === null ||
      intersection.penetration < minIntersection.penetration
    ) {
      minIntersection = intersection;
    }
  }

  return minIntersection;
};

export const sat = (
  vectorsA: IVector[],
  vectorsB: IVector[]
): IIntersection | null => {
  let intersectionA = _sat(vectorsA, vectorsB);
  // let intersectionB = _sat(vectorsB, vectorsA);

  //  if (!intersectionA || !intersectionB) return null;

  //if (Math.abs(intersectionA.penetration) === 0) return null;
  //if (Math.abs(intersectionB.penetration) === 0) return null;

  return intersectionA;
};
