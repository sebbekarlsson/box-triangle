export const range = (n: number): number[] => Array.from(Array(n).keys());

export const randRange = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


export const dice = (chance: number) => {
  const v = randRange(0, 100);

  const p1 = chance / 100.0;
  const p2 = v / 100.0;

  return p1 >= p2;
}

export const choose = (a: any, b: any, chance: number) => dice(chance) ? a : b;


export const radians = (v: number) => v * Math.PI / 180.0;
