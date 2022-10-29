import { factory, primaryKey } from "@mswjs/data";
import { rest } from "msw";
import { mockConfig } from "./config";

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export const api = {
  fetchAllTodos: "https://jsonplaceholder.typicode.com/todos?_limit=10",
  fetchTodoById: "https://jsonplaceholder.typicode.com/todos/:id",
  fetchTodoById2: "todos/:id",
  createTodo: "https://jsonplaceholder.typicode.com/todos",
  updateTodoById: "https://jsonplaceholder.typicode.com/todos/:id",
  deleteTodoById: "https://jsonplaceholder.typicode.com/todos/:id",
} as const;

const db = factory({
  todo: {
    id: primaryKey(Number),
    title: String,
    completed: Boolean,
    userId: Number,
  },
});

export const todoHandlers = {
  "Get todo by id": rest.get(api.fetchTodoById, async (req, res, ctx) => {
    // Retrieve original response
    const originalResponse = await ctx.fetch(req);
    const originalResponseData = (await originalResponse.json()) as Todo;

    if (mockConfig.enableTodoMock) {
      const data = db.todo.findFirst({
        where: { id: { equals: originalResponseData.id } },
      });
      if (!data) {
        db.todo.create(originalResponseData);
        return res(ctx.json(originalResponseData));
      } else {
        const updatedData = db.todo.update({
          where: { id: { equals: originalResponseData.id } },
          data: { ...originalResponseData, ...data },
        });
        return res(ctx.json(updatedData));
      }
    } else {
      return res(ctx.json(originalResponseData));
    }
  }),

  "Update todo": rest.put(api.updateTodoById, async (req, res, ctx) => {
    // Retrieve original response
    const originalResponse = await ctx.fetch(req);
    const originalResponseData = (await originalResponse.json()) as Todo;
    // Set updated item to cache overriding the existing one
    db.todo.update({
      where: { id: { equals: originalResponseData.id } },
      data: originalResponseData,
    });

    return res(ctx.json(originalResponseData));
  }),

  "Fetch todos": rest.get(api.fetchAllTodos, async (req, res, ctx) => {
    // Retrieve original response
    const originalResponse = await ctx.fetch(req);
    let originalResponseData = (await originalResponse.json()) as Todo[];

    // Iterates all existing todos and patch their values by the corresponding
    // item, if present in cache
    originalResponseData.forEach((todo) => {
      const existingTodo = db.todo.findFirst({
        where: { id: { equals: todo.id } },
      });
      if (existingTodo) {
        Object.assign(todo, existingTodo);
      }
    });

    return res(ctx.json(originalResponseData));
  }),
};
