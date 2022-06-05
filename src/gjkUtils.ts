import { IEdge } from "./gjkTypes";
import { ESimplexWinding, ISimplex } from "./simplex";
import { IVector, vec3, vec3Add, vec3Cross, vec3Dot, vec3Mag, vec3Scale, vec3Sub, vec3TripleProduct, vec3Unit } from "./vector";

export const sameDir = (d1: IVector, d2: IVector) =>
  vec3Dot(vec3Unit(d1), vec3Unit(d2)) > 0;



export const getAreaWeightedCenter = (polygon: IVector[]): IVector => {
  if (polygon.length === 1) {
    return polygon[0];
  }

  let ac = vec3(0.0, 0.0, 0.0);

  polygon.forEach((vector) => {
    ac = vec3Add(ac, vector);
  });
  ac = vec3Scale(ac, 1.0 / polygon.length);

  let center = vec3(0.0, 0.0, 0.0);
  let area = 0.0;
  var inv3 = 1.0 / 3.0;

  polygon.forEach((vector, index) => {
    let p1 = vector;
    let p2 = index + 1 === polygon.length ? polygon[0] : polygon[index + 1];

    p1 = vec3Add(p1, vec3Scale(ac, -1));
    p2 = vec3Add(p2, vec3Scale(ac, -1));

    const triangleArea = 0.5 * vec3Mag(vec3Cross(p1, p2));
    area += triangleArea;

    center = vec3Add(
      center,
      vec3Scale(vec3Scale(vec3Add(p1, p2), inv3), triangleArea)
    );
  });

  if (area == 0) {
    // zero area can only happen if all the points are the same point
    // in which case just return a copy of the first
    return polygon[0];
  }

  // return the center
  return vec3Add(vec3Scale(center, 1 / area), ac);
};

export const furthestPoint = (vectors: IVector[], axis: IVector) => {
  let max = -Infinity;
  let point = vec3(0.0, 0.0, 0.0);
  for (let i = 0; i < vectors.length; i++) {
    const v = vectors[i];
    const dot = vec3Dot(v, axis);
    // if (dot == 0) continue;

    if (dot > max) {
      max = dot;
      point = v;
    }
  }

  return point;
};

export const findEdgeVectors = (points: IVector[]): IVector[] => {
    let edges: IVector[] = [];

    for (let i = 0; i < points.length; i++) {

        const j = i + 1 === points.length ? 0 : i + 1;

        const a = points[i];
        const b = points[j];

        const e = vec3Sub(b, a);

        edges.push(e);
    }

    return edges;
}


export const getWinding = (points: IVector[]) => {
    let sum: number = 0;
    const edges: IVector[] = findEdgeVectors(points);

    for (let i = 0; i < points.length; i++) {
        const edge = edges[i];
        const p = points[i];
        sum += edge.x + edge.y + edge.z;
    }

    if (sum > 0) return ESimplexWinding.CLOCKWISE;
    return ESimplexWinding.COUNTER_CLOCKWISE;
}

export const findClosestEdge = (simplex: ISimplex): IEdge => {
    let closest: IEdge = { distance: Number.MAX_VALUE, normal: vec3(1, 0, 0), index: 0 };

    let points: IVector[] = simplex.vertices;
    const s = simplex.sumDir ? simplex.sumDir.x + simplex.sumDir.y + simplex.sumDir.z : 0;
    const winding: ESimplexWinding = getWinding(points);// s >= 0 ? ESimplexWinding.CLOCKWISE : ESimplexWinding.COUNTER_CLOCKWISE; //getWinding(points);

    let bob = true;

    for (let i = 0; i < points.length; i++) {

        const j = (i+1)%points.length;//i + 1 === points.length ? 0 : i + 1;

        const a = points[i];
        const b = points[j];

        const e = vec3Sub(b, a);

        const oa = a;
        let n = vec3Unit(vec3TripleProduct(e, oa, e));
       // n = vec3Unit(n);

        if (bob) {
          n = vec3Unit(e);

          if (winding == ESimplexWinding.CLOCKWISE) {
              n  = vec3(n.y, n.x, n.z);//vec3Scale(n, -1);
          } else {
              n = vec3(-n.y, n.x, n.z);
          }
        }

        const d: number = vec3Dot(n, a);

        if (d < closest.distance) {
            closest.distance = d;
            closest.normal = n;
            closest.index = j;
        }
    }

    return closest;
}

export const getSupport = (
  a: IVector[],
  b: IVector[],
  axis: IVector
): IVector => {
  const p1 = furthestPoint(a, axis);
  const p2 = furthestPoint(b, vec3Scale(axis, -1));
  return vec3Sub(p1, p2);
};
