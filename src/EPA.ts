import { findClosestEdge, getSupport } from "./gjkUtils";
import { ISimplex } from "./simplex";
import { IVector, vec3, vec3Dot } from "./vector";

const TOLERANCE = 0.00001;

export interface IEpa {
    normal: IVector;
    depth: number;
}

export const EPA = (simplex: ISimplex, a: IVector[], b: IVector[]): IEpa => {
    let normal: IVector = vec3(0, 0, 0);
    let depth: number = 0;

    const maxIter = ((a.length + b.length));


    for (let i = 0; i < maxIter; i++) {
        const edge = findClosestEdge(simplex);
      const p = getSupport(a, b, edge.normal);
      const d = vec3Dot(p, edge.normal);


        if (d - edge.distance < TOLERANCE) {
            normal = edge.normal;
            depth = d;
        } else {
            simplex.vertices.splice(edge.index, 0, p);
        }
    }

    depth = Math.max(0, depth - 0.001);
    return { normal, depth };
}
