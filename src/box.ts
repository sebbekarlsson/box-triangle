import { IIntersection } from "./intersection";
import { IVector, vec3, vec3Add, vec3Sub } from "./vector";
import { sat } from "./sat";

export interface IBox {
  min: IVector;
  max: IVector;
}

export const createBox = (pos: IVector, size: IVector): IBox => {
  return { min: pos, max: vec3Add(pos, size) };
};

export const getBoxVectors = (box: IBox): IVector[] => {
  const pos = box.min;
  const size = vec3Sub(box.max, box.min);
  const v1 = vec3(0, size.y, 0);
  const v2 = vec3(size.x, size.y, 0);
  const v3 = vec3(size.x, 0, 0);
  const v4 = vec3(0, 0, 0);

  // left
  const v5 = vec3(0, size.y, 0);
  const v6 = vec3(0, size.y, size.z);
  const v7 = vec3(0, 0, size.z);
  const v8 = vec3(0, 0, 0);

  // back
  const v9 = vec3(0, size.y, size.z);
  const v10 = vec3(size.x, size.y, size.z);
  const v11 = vec3(size.x, 0, size.z);
  const v12 = vec3(0, 0, size.z);

  // right
  const v13 = vec3(size.x, size.y, 0);
  const v14 = vec3(size.x, size.y, size.z);
  const v15 = vec3(size.x, 0, size.z);
  const v16 = vec3(size.x, 0, 0);

  // top
  const v17 = vec3(0, size.y, 0);
  const v18 = vec3(0, size.y, size.z);
  const v19 = vec3(size.x, size.y, size.z);
  const v20 = vec3(size.x, size.y, 0);

  // bottom
  const v21 = vec3(0, 0, 0);
  const v22 = vec3(0, 0, size.z);
  const v23 = vec3(size.x, 0, size.z);
  const v24 = vec3(size.x, 0, 0);

  return [
    v1,
    v2,
    v3,
    v4,
    v5,
    v6,
    v7,
    v8,
    v9,
    v10,
    v11,
    v12,
    v13,
    v14,
    v15,
    v16,
    v17,
    v18,
    v19,
    v20,
    v21,
    v22,
    v23,
    v24,
  ].map((v) => vec3Add(v, pos));
};

export const boxIntersection = (boxA: IBox, boxB: IBox): IIntersection | null =>
  sat(getBoxVectors(boxA), getBoxVectors(boxB));
