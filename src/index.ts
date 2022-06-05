import "./style.css";
import { IContext, IState } from "./types";
import { IVector, vec3, vec3Add, vec3Scale, vec3String, vec3Sub, vec3Unit } from "./vector";
import { createActor, drawActor, EActorType, IActor, updateActor } from "./actor";
import { range, randRange, choose } from "./utils";
import { drawArrow, drawText } from "./draw";

let state: IState = {
  mouse: vec3(0, 0, 0),
  actors: [],
  arrow: vec3(0, 0, 0)
};


const createLine = (start: IVector, end: IVector, w: number, h: number): IActor => {
  let a = createActor(
        vec3(randRange(0, w), randRange(0, h), 0),
        vec3(randRange(4, 32), randRange(4, 32), 0),
        EActorType.ACTOR_LINE,
        vec3(255, 0, 0),
        false
    )


  return {...a, primitive: { start, end: vec3Add(start, end) }}
}

const setup = (): IContext => {
  const canvas: HTMLCanvasElement = document.getElementById(
    "canvas"
  ) as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");

  const rect = canvas.parentElement.getBoundingClientRect();

  const scalar = 1.5;
  const w = rect.width / scalar;
  const h = (w / 16) * 9;

  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  canvas.addEventListener("mousemove", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offset = vec3(rect.left, rect.top, 0);
    state.mouse = vec3(event.clientX - offset.x, event.clientY - offset.y, 0);
  });

  let nextActors = [
    ...range(10).map((i) =>

    // createLine(vec3(randRange(0, w), randRange(0, h), 0), vec3(randRange(16, 200), randRange(16, 200), 0), w, h)
   createActor(
        vec3(randRange(0, w), randRange(0, h), 0),
        vec3(randRange(16, 92), randRange(16, 92), 0),
        choose(EActorType.ACTOR_TRIANGLE, EActorType.ACTOR_BOX, 50),
        vec3(255, 255, 255)
      )
    ),
    createActor(
      vec3(randRange(0, w), randRange(0, h), 0),
      vec3(64, 64, 0),
      EActorType.ACTOR_TRIANGLE,
      vec3(0, 255, 0),
      true
    ),
  ];

  state.actors = nextActors;

  return { ctx, width: w, height: h, state };
};

const context = setup();

const update = (context: IContext) => {
  const center = vec3(context.width / 2, context.height/2, 0);
  state.arrow = vec3Scale(vec3Unit(vec3Sub(state.mouse, center)), 256.0);
  for (let i = 0; i < state.actors.length; i++) {
    const actor = state.actors[i];
    state.actors[i] = updateActor(context, state, actor);
  }
};

const clear = (context: IContext) => {
  const { ctx, width, height } = context;

  ctx.clearRect(0, 0, width, height);
};

const draw = (context: IContext) => {
  clear(context);

  const center = vec3(context.width / 2, context.height/2, 0);
  drawArrow(context, center, vec3Add(center, state.arrow), 10, { color: vec3(255, 0, 0) });

  for (const actor of state.actors) {
    drawActor(context, actor);
  }


  if (context.state.epa) {
    const epa = context.state.epa;
    drawText(context, vec3(16, 16, 0), `Depth: ${epa.depth.toFixed(3)}`, { color: vec3(255, 255, 255) });
    drawText(context, vec3(16, 32, 0), `Normal: ${vec3String(epa.normal)}`, { color: vec3(255, 255, 255) });
  }
};

const loop = (context: IContext) => {
  update(context);
  draw(context);
  requestAnimationFrame(() => loop(context));
};

loop(context);
