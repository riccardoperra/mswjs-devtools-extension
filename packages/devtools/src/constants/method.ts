export const routeMethods = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTION",
  "ALL",
] as const;

export type RouteMethods = typeof routeMethods[number];
