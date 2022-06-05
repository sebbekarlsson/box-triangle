import { IVector } from "./vector";
import { IActor } from "./actor";
import { IEpa } from "./EPA";

export interface IContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  state: IState;
}

export interface IDraw {
  color: IVector;
  fontSize?: number;
  fontFamily?: string;
}

export interface IState {
  mouse: IVector;
  actors: IActor[];
  arrow: IVector;
  epa?: IEpa;
}
