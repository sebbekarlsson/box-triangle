import { IContext, IDraw } from "./types";
import { ITriangle } from "./triangle";
import { IVector, vec3Color } from "./vector";
import { getBoxVectors, IBox } from "./box";
import { ILine } from "./line";

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

export const drawLine = (context: IContext, line: ILine, draw: IDraw) => {
  const { start, end } = line;
  const { color } = draw;
  const { ctx } = context;
  ctx.save();
  ctx.strokeStyle = vec3Color(color);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}

export const drawArrow = (context: IContext, start: IVector, end: IVector, headLength: number, draw: IDraw) => {
  const { color } = draw;
  const { ctx } = context;
  const headlen = headLength; // length of head in pixels
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx);
  ctx.save();
  ctx.strokeStyle = vec3Color(color);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}

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

export const drawPoint = (context: IContext, point: IVector, radius: number, draw: IDraw) => {
    const { color } = draw;
  const { ctx } = context;
  ctx.save();
  ctx.strokeStyle = vec3Color(color);
  ctx.fillStyle = vec3Color(color);

  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, 2 *Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}


export const drawText = (context: IContext, pos: IVector, text: string, draw: IDraw) => {
  const { ctx } = context;
  const { color } = draw;
  const fontSize = draw.fontSize || 14;
  const fontFamily = draw.fontFamily || "SansSerif";

  ctx.save();
  ctx.strokeStyle = vec3Color(color);
  ctx.fillStyle = vec3Color(color);
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillText(text, pos.x, pos.y);
  ctx.restore();
}
