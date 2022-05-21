import "./style.css";
import { IContext, IState } from "./types";
import { vec3, vec3Sub } from "./vector";
import { createActor, drawActor, EActorType, updateActor } from "./actor";
import { range, randRange } from "./utils";

let state: IState = {
  mouse: vec3(0, 0, 0),
  actors: [],
};

const setup = (): IContext => {
  const canvas: HTMLCanvasElement = document.getElementById(
    "canvas"
  ) as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");

  const rect = canvas.parentElement.getBoundingClientRect();

  const scalar = 2;
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
    ...range(100).map((i) =>
      createActor(
        vec3(randRange(0, w), randRange(0, h), 0),
        vec3(randRange(4, 32), randRange(4, 32), randRange(4, 32)),
        EActorType.ACTOR_TRIANGLE,
        vec3(255, 255, 255)
      )
    ),
    createActor(
      vec3(0, 0, 0),
      vec3(64, 64, 64),
      EActorType.ACTOR_BOX,
      vec3(0, 255, 0),
      true
    ),
  ];

  state.actors = nextActors;

  return { ctx, width: w, height: h };
};

const context = setup();

const update = (context: IContext) => {
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

  for (const actor of state.actors) {
    drawActor(context, actor);
  }
};

const loop = (context: IContext) => {
  update(context);
  draw(context);
  requestAnimationFrame(() => loop(context));
};

loop(context);
