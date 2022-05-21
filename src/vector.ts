export interface IVector {
  x: number;
  y: number;
  z: number;
}

export const vec3 = (x: number, y: number, z: number): IVector => ({ x, y, z });
export const vec3Sub = (v1: IVector, v2: IVector): IVector => ({
  x: v1.x - v2.x,
  y: v1.y - v2.y,
  z: v1.z - v2.z,
});

export const vec3Add = (v1: IVector, v2: IVector): IVector => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
  z: v1.z + v2.z,
});
export const vec3Scale = (v1: IVector, v: number): IVector => ({
  x: v1.x * v,
  y: v1.y * v,
  z: v1.z * v,
});

export const vec3Dot = (v1: IVector, v2: IVector) => {
  const dot_x = v1.x * v2.x;
  const dot_y = v1.y * v2.y;
  const dot_z = v1.z * v2.z;

  return dot_x + dot_y + dot_z;
};

export const vec3Mag = (v: IVector):number => {
  return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));
}

export const vec3Unit = (v: IVector): IVector => {
  const mag = vec3Mag(v);
  if (mag === 0) return vec3(0, 0, 0);

  return vec3(v.x / mag, v.y / mag, v.z / mag);
}

export const vec3Color = (v: IVector): string =>
  `rgb(${Math.round(v.x)},${Math.round(v.y)},${Math.round(v.z)})`;
