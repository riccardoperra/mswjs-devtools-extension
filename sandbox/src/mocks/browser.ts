import { setupWorker } from "msw";
import { todoHandlers } from "./handlers";

export const worker = setupWorker(...Object.values(todoHandlers));
