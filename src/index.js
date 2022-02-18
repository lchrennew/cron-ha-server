import { startServer } from "koa-es-template";
import IndexController from "./web/routes/index.js";

await startServer({ index: IndexController })
