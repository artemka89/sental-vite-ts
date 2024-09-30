import { Route } from "../shared/lib/router/create-router";
import { App } from "./app";

export const routes: Route[] = [
  {
    path: "/",
    element: App,
    redirect: "/users",
  },
  {
    path: "*",
    element: () => {
      const noFound = document.createElement("div");
      noFound.innerText = "404 Page not found";
      noFound.style.display = "flex";
      noFound.style.justifyContent = "center";
      noFound.style.alignItems = "center";
      noFound.style.height = "100vh";
      noFound.style.fontSize = "2rem";
      return noFound;
    },
  },
];
