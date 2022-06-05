import { vec3, IVector, vec3Add, vec3Scale, vec3Sub, vec3Unit, vec3Dot } from "./vector";
import { drawArrow, drawBox, drawLine, drawPoint, drawTriangle } from "./draw";
import {
  triangleBoxIntersection,
  ITriangle,
  triangleTriangleIntersection,
  triangleGetVectors,
} from "./triangle";
import { IContext, IState } from "./types";
import { boxIntersection, createBox, getBoxVectors, IBox } from "./box";
import { furthestPoint, getAreaWeightedCenter } from "./gjkUtils";
import { gjk  } from './gjk';
import { ILine } from "./line";

export enum EActorType {
  ACTOR_BOX,
  ACTOR_TRIANGLE,
  ACTOR_LINE
}

export interface IActor {
  position: IVector;
  velocity: IVector;
  size: IVector;
  type: EActorType;
  color: IVector;
  primitive: ITriangle | IBox | ILine;
  followMouse?: boolean;
}

export const actorGetVertices = (actor: IActor): IVector[] => {
  switch (actor.type) {
    case EActorType.ACTOR_BOX: return getBoxVectors(actor.primitive as IBox);
    case EActorType.ACTOR_TRIANGLE: return triangleGetVectors(actor.primitive as ITriangle);
    case EActorType.ACTOR_LINE:  {
      const stuff = [(actor.primitive as ILine).start, (actor.primitive as ILine).end];
      return stuff;
    };
  }

}

const lerp = (vector: IVector, to: number, step: number): IVector => {
  let v = {...vector};

  v.x = v.x + (to - v.x) * step;
  v.y = v.y + (to - v.y) * step;
  v.z = v.z + (to - v.z) * step;

  return v;
}

export const createActor = (
  position: IVector,
  size: IVector,
  type: EActorType,
  color: IVector,
  followMouse?: boolean,
  line?: ILine,
  velocity: IVector = vec3(0, 0, 0)
): IActor => ({
  position,
  velocity,
  size,
  type,
  color,
  followMouse,
  primitive: type === EActorType.ACTOR_LINE ? line :
    type === EActorType.ACTOR_BOX
      ? createBox(position, size)
      : {
          v1: position,
          v2: vec3Add(position, vec3(0, size.y, 0)),
          v3: vec3Add(position, vec3(size.x, 0, 0)),
        },
});

const drawActorTriangle = (context: IContext, actor: IActor) => {
  drawTriangle(context, actor.primitive as ITriangle, {
    color: actor.color,
  });


  const vectors = actorGetVertices(actor);

  const support = furthestPoint(vectors, vec3Unit(context.state.arrow));

 // const center = getAreaWeightedCenter(vectors);

  drawPoint(context, support, 4, { color: vec3(255, 0, 0) });
//  drawPoint(context, center, 2, { color: vec3(0, 255, 0) });
}

const drawActorBox = (context: IContext, actor: IActor) => {
  drawBox(context, actor.primitive as IBox, {
          color: actor.color,
    });
  const support = furthestPoint(actorGetVertices(actor), vec3Unit(context.state.arrow));
  drawPoint(context, support, 4, { color: vec3(255, 0, 0) });
}

const drawActorLine = (context: IContext, actor: IActor) => {
  const support = furthestPoint(actorGetVertices(actor), vec3Unit(context.state.arrow));
  drawLine(context, actor.primitive as ILine, { color: actor.color });
  drawPoint(context, support, 4, { color: vec3(255, 0, 0) });
}

export const drawActor = (context: IContext, actor: IActor) => {
  switch (actor.type) {
    case EActorType.ACTOR_BOX:
      {
        drawActorBox(context, actor);
      }
      break;
    case EActorType.ACTOR_TRIANGLE:
      {
        drawActorTriangle(context, actor);
      }
      break;
          case EActorType.ACTOR_LINE:
      {
        drawActorLine(context, actor);
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
    actor.followMouse,
    actor.primitive as ILine,
    actor.velocity
  );
  nextActor.color = vec3(255, 255, 255);
  if (actor.followMouse) {
    const prevPos = actor.position;
    const vel = vec3Sub(state.mouse, prevPos);
    nextActor.velocity = vel;
    nextActor.position = state.mouse;
   // const halfSize = vec3Scale(actor.size, 0.5);
    //nextActor.position = vec3Sub(state.mouse, halfSize);
  }

  for (const other of state.actors) {
    if (other == actor) continue;

    nextActor.color = vec3(255, 255, 255);


    const result =  gjk(actorGetVertices(actor), actorGetVertices(other), vec3(-1, 0, 0));

    if (result) {
        nextActor.color = vec3(255, 0, 0);
      if (Math.abs(result.depth) > 0) {
        state.epa = result;


        const velDiff = vec3Sub(actor.velocity, other.velocity);
        const dot = vec3Dot(velDiff, result.normal);

        if (!(dot < 0)) {
          const force = -dot;


          const SA = Math.max(actor.size.x, actor.size.y, actor.size.z);
          const SB = Math.max(other.size.x, other.size.y, other.size.z);
          const invA = 1.0 / SA;
          const invB = 1.0 / SB;

          const fix = result.depth * (invA / invB);

          const impulse = vec3Scale(result.normal, force);
          const impulseA = vec3Scale(impulse, 1);
          const impulseB = vec3Scale(impulse, -1);
          const correctA = vec3Scale(result.normal, -fix);
          const correctB = vec3Scale(result.normal, fix);

          if (!nextActor.followMouse) {
            nextActor.velocity = vec3Add(nextActor.velocity, impulseA);
            nextActor.position = vec3Add(nextActor.position, correctA);
          }

          if (!other.followMouse) {
            other.velocity = vec3Add(other.velocity, impulseB);
            other.position = vec3Add(other.position, correctB);
          }
        }
      }
    } else {
        nextActor.color = vec3(255, 255, 255);
        //other.color = vec3(255, 255, 255);
    }

  /*  if (
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
    }*/ /* else if (actor.type === EActorType.ACTOR_TRIANGLE && other.type === EActorType.ACTOR_TRIANGLE) {
      if (triangleTriangleIntersection(actor.primitive as ITriangle, other.primitive as ITriangle)){
        nextActor.color = vec3(255, 0, 0);
      }
    }*/
  }

  if (!nextActor.followMouse)
  nextActor.position = vec3Add(nextActor.position, nextActor.velocity);


  const fric = 0.5;

  nextActor.velocity = lerp(nextActor.velocity, 0, fric);

  return nextActor;
};
