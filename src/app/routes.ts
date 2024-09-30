import { Route } from "../shared/lib/router/create-router";
import { App } from "./app";

export const routes: Route[] = [
  {
    path: "/users",
    element: App,
  },
];
