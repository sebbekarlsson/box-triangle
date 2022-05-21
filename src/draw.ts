import { IContext, IDraw } from "./types";
import { ITriangle } from "./triangle";
import { vec3Color } from "./vector";
import { getBoxVectors, IBox } from "./box";

export const drawTriangle = (
  context: IContext,
  triangle: ITriangle,
  draw: IDraw
) => {
  const { color } = draw;
  const { ctx } = context;

  ctx.save();
  ctx.strokeStyle = vec3Color(color);

  ctx.beginPath();

  ctx.moveTo(triangle.v1.x, triangle.v1.y);
  ctx.lineTo(triangle.v2.x, triangle.v2.y);
  ctx.lineTo(triangle.v3.x, triangle.v3.y);

  ctx.closePath();
  ctx.stroke();

  ctx.restore();
};

export const drawBox = (context: IContext, box: IBox, draw: IDraw) => {
  const { color } = draw;
  const { ctx } = context;
  ctx.save();
  ctx.strokeStyle = vec3Color(color);

  ctx.beginPath();

  const vectors = getBoxVectors(box);

  for (let i = 0; i < vectors.length; i++) {
    const v1 = vectors[i];
    const v2 = vectors[(i + 1) % vectors.length];
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
  }

  ctx.closePath();
  ctx.stroke();

  ctx.restore();
};
