import { IBox, getBoxVectors, createBox, boxIntersection } from "./box";
import { vec3 } from "./vector";
import { sat } from "./sat";
import { ITriangle, triangleBoxIntersection } from "./triangle";

const testBoxIntersection = () => {
  const boxA: IBox = createBox(vec3(0, 0, 0), vec3(16, 16, 16));
  const boxB: IBox = createBox(vec3(1, 1, 1), vec3(16, 16, 16));

  const intersection = boxIntersection(boxA, boxB);
  console.log(intersection);
};

const testTriangleBoxIntersection = () => {
  const boxA: IBox = createBox(vec3(0, 0, 0), vec3(16, 16, 16));
  const triangle: ITriangle = {
    v1: vec3(0, 0, 0),
    v2: vec3(8, 8, 8),
    v3: vec3(2, 2, 2),
  };

  const intersection = triangleBoxIntersection(triangle, boxA);

  console.log(intersection);
};

const main = () => {
  testBoxIntersection();
  testTriangleBoxIntersection();
};

main();
