import { createRouter } from "../shared/lib/router/create-router";
import { routes } from "./routes";

import "./style/normalize.css";
import "./style//variables.css";
import "./style/global.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

createRouter(routes, app);
