export interface IVector {
  x: number;
  y: number;
  z: number;
}
const floatify = (v: number) => parseFloat(v.toFixed(16));

export const vec3 = (x: number, y: number, z: number): IVector => ({ x: floatify(x), y: floatify(y), z: floatify(z) });
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
  v1 = vec3ForceFloat(v1);
  v2 = vec3ForceFloat(v2);
  const dot_x = v1.x * v2.x;
  const dot_y = v1.y * v2.y;
  const dot_z = v1.z * v2.z;

  return dot_x + dot_y + dot_z;
};



export const vec3ForceFloat = (a: IVector):IVector => {
  return vec3(floatify(a.x), floatify(a.y), floatify(a.z));
}

export const vec3TripleProduct = (a: IVector, b: IVector, c: IVector): IVector => vec3Cross(a, vec3Cross(b, c));

export const vec3Cross = (a: IVector, b: IVector): IVector => {
  a = vec3ForceFloat(a);
  b = vec3ForceFloat(b);
  const x = a.y * b.z - a.z * b.y;
  const y = a.z * b.x - a.x * b.z;
  const z = a.x * b.y - a.y * b.x;
  return vec3(x, y, z);
}

export const vec3Mag = (v: IVector): number => {
  v = vec3ForceFloat(v);
  return floatify(Math.sqrt(Math.pow(v.x, 2.0) + Math.pow(v.y, 2.0) + Math.pow(v.z, 2.0)));
};


export const vec3Unit = (v: IVector): IVector => {
  const mag = vec3Mag(v);
  if (mag === 0) return vec3(0.0, 0.0, 0.0);
  return vec3ForceFloat(vec3(v.x / mag, v.y / mag, v.z / mag));
};

export const vec3Color = (v: IVector): string =>
  `rgb(${Math.round(v.x)},${Math.round(v.y)},${Math.round(v.z)})`;


const fix = (n: number) => n.toFixed(3)

export const vec3String = (v: IVector): string => `(${fix(v.x)}, ${fix(v.y)}, ${fix(v.z)})`;
