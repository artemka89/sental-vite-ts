import { createRouter } from "../shared/lib/router/create-router";
import { routes } from "./routes";

import "./style/normalize.css";
import "./style//variables.css";
import "./style/global.css";

// Задача на типизацию ------------
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[]
    ? DeepReadonly<U>[]
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

interface Example {
  foo: string;
  bar: number[];
  baz: {
    qux: string;
  };
}

export type ReadonlyExample = DeepReadonly<Example>;

// --------------------------------

const app = document.querySelector<HTMLDivElement>("#app")!;

createRouter(routes, app);
