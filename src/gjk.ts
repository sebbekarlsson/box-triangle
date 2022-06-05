import { EPA, IEpa } from "./EPA";
import { GJK_DEFAULT, IGJK, IGJKData } from "./gjkTypes";
import { getSupport, sameDir } from "./gjkUtils";
import { ISimplex } from "./simplex";
import {
  IVector,
  vec3,
    vec3Add,
  vec3Cross,
  vec3Dot,
  vec3ForceFloat,
  vec3Scale,
  vec3Sub,
} from "./vector";



const nextLine = (simplex: ISimplex, dir: IVector): IGJK => {
  dir = vec3ForceFloat(dir);
  let nextSimplex: ISimplex = { ...simplex };
  const a = simplex.vertices[0];
  const b = simplex.vertices[1];
  const ab = vec3Sub(b, a);
  const ao = vec3Scale(a, -1);

  if (sameDir(ab, ao)) {
    dir = vec3Cross(vec3Cross(ab, ao), ab);
  } else {
    nextSimplex.vertices[0] = a;
    dir = ao;
  }

    return { intersects: false, simplex: {...nextSimplex, sumDir: vec3Add(simplex.sumDir, dir)}, dir };
};
const nextTriangle = (simplex: ISimplex, dir: IVector): IGJK => {
  let nextSimplex: ISimplex = { ...simplex};
  const a = simplex.vertices[0];
  const b = simplex.vertices[1];
  const c = simplex.vertices[2];

  const ab = vec3Sub(b, a);
  const ac = vec3Sub(c, a);
  const ao = vec3Scale(a, -1);
  const abc = vec3Cross(ab, ac);

  if (sameDir(vec3Cross(abc, ac), ao)) {
    if (sameDir(ac, ao)) {
      nextSimplex.vertices = [a, c];
      dir = vec3Cross(vec3Cross(ac, ao), ac);
      //  return nextLine({ vertices: [a, c] }, dir);
    } else {
      return nextLine({ vertices: [a, b], sumDir: vec3Add(simplex.sumDir, dir) }, dir);
    }
  } else {
    if (sameDir(vec3Cross(ab, abc), ao)) {
      return nextLine({ vertices: [a, b], sumDir: vec3Add(simplex.sumDir, dir) }, dir);
    } else {
      if (sameDir(abc, ao)) {
        dir = abc;
      } else {
        nextSimplex.vertices = [a, c, b];
        dir = vec3Scale(abc, -1);
      }
    }
  }

    return { intersects: true, simplex: {...nextSimplex, sumDir: vec3Add(simplex.sumDir, dir)}, dir };
};
const nextTetra = (simplex: ISimplex, dir: IVector): IGJK => {
  const a = simplex.vertices[0];
  const b = simplex.vertices[1];
  const c = simplex.vertices[2];
  const d = simplex.vertices[3];

  const ab = vec3Sub(b, a);
  const ac = vec3Sub(c, a);
  const ad = vec3Sub(d, a);
  const ao = vec3Scale(a, -1);

  const abc = vec3Cross(ab, ac);
  const acd = vec3Cross(ac, ad);
  const abd = vec3Cross(ad, ab);

  if (sameDir(abc, ao)) {
      return nextTriangle({ vertices: [a, b, c], sumDir: vec3Add(simplex.sumDir, dir) }, dir);
  }

  if (sameDir(acd, ao)) {
    return nextTriangle({ vertices: [a, c, d], sumDir: vec3Add(simplex.sumDir, dir) }, dir);
  }

  if (sameDir(abd, ao)) {
    return nextTriangle({ vertices: [a, d, b], sumDir: vec3Add(simplex.sumDir, dir) }, dir);
  }

    return { intersects: true, simplex: {...simplex, sumDir: vec3Add(simplex.sumDir, dir)}, dir };
};

const nextSimplex = (simplex: ISimplex, dir: IVector): IGJK => {
  switch (simplex.vertices.length) {
    case 2:
      return nextLine(simplex, dir);
    case 3:
      return nextTriangle(simplex, dir);
    case 4:
      return nextTetra(simplex, dir);
    default: {
      return GJK_DEFAULT;
    }
  }
};


export const gjk = (
  a: IVector[],
  b: IVector[],
  dir: IVector
): IEpa | null => {
const maxIter = a.length + b.length;
  let support = getSupport(a, b, dir);

  let simplex: ISimplex = { vertices: [], sumDir: dir };

  simplex.vertices.push(support);
  dir = vec3Scale(support, -1);


  for (let i = 0; i < maxIter; i++) {
    support = getSupport(a, b, dir);

    if (vec3Dot(support, dir) <= 0) return null;

    simplex.vertices.unshift(support); //[support, simplex.vertices[0], simplex.vertices[1], simplex.vertices[2]];//.push(support);

    const next = nextSimplex(simplex, dir);

      if (next.intersects) return EPA(simplex, a, b);

    simplex = next.simplex;
    dir = next.dir;
    simplex.sumDir = vec3Add(simplex.sumDir, dir);
  }
};
