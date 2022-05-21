import { vec3, IVector, vec3Add, vec3Scale, vec3Sub } from "./vector";
import { drawBox, drawTriangle } from "./draw";
import {
  triangleBoxIntersection,
  ITriangle,
  triangleTriangleIntersection,
} from "./triangle";
import { IContext, IState } from "./types";
import { boxIntersection, createBox, IBox } from "./box";

export enum EActorType {
  ACTOR_BOX,
  ACTOR_TRIANGLE,
}

export interface IActor {
  position: IVector;
  size: IVector;
  type: EActorType;
  color: IVector;
  primitive: ITriangle | IBox;
  followMouse?: boolean;
}

export const createActor = (
  position: IVector,
  size: IVector,
  type: EActorType,
  color: IVector,
  followMouse?: boolean
): IActor => ({
  position,
  size,
  type,
  color,
  followMouse,
  primitive:
    type === EActorType.ACTOR_BOX
      ? createBox(position, size)
      : {
          v1: position,
          v2: vec3Add(position, vec3(0, size.y, 0)),
          v3: vec3Add(position, vec3(size.x, 0, 0)),
        },
});

export const drawActor = (context: IContext, actor: IActor) => {
  switch (actor.type) {
    case EActorType.ACTOR_BOX:
      {
        drawBox(context, actor.primitive as IBox, {
          color: actor.color,
        });
      }
      break;
    case EActorType.ACTOR_TRIANGLE:
      {
        drawTriangle(context, actor.primitive as ITriangle, {
          color: actor.color,
        });
      }
      break;
  }
};

export const updateActor = (
  context: IContext,
  state: IState,
  actor: IActor
): IActor => {
  let nextActor = createActor(
    actor.position,
    actor.size,
    actor.type,
    actor.color,
    actor.followMouse
  );
  nextActor.color = vec3(255, 255, 255);
  if (actor.followMouse) {
    const halfSize = vec3Scale(actor.size, 0.5);
    nextActor.position = vec3Sub(state.mouse, halfSize);
  }

  for (const other of state.actors) {
    if (other == actor) continue;

    if (
      other.type == EActorType.ACTOR_BOX &&
      actor.type == EActorType.ACTOR_TRIANGLE
    ) {
      if (
        triangleBoxIntersection(
          actor.primitive as ITriangle,
          other.primitive as IBox
        )
      ) {
        nextActor.color = vec3(255, 0, 0);
      }
    } else if (
      other.type == EActorType.ACTOR_TRIANGLE &&
      actor.type == EActorType.ACTOR_BOX
    ) {
      if (
        triangleBoxIntersection(
          other.primitive as ITriangle,
          actor.primitive as IBox
        )
      ) {
        nextActor.color = vec3(255, 0, 0);
      }
    } /* else if (actor.type === EActorType.ACTOR_TRIANGLE && other.type === EActorType.ACTOR_TRIANGLE) {
      if (triangleTriangleIntersection(actor.primitive as ITriangle, other.primitive as ITriangle)){
        nextActor.color = vec3(255, 0, 0);
      }
    }*/
  }

  return nextActor;
};
