import { IVector } from "./vector";
import { IActor } from "./actor";

export interface IContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export interface IDraw {
  color: IVector;
}

export interface IState {
  mouse: IVector;
  actors: IActor[];
}
