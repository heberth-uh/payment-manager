/*
  Type dedicated to standardizing the structure of successfull and failed API responses across the application
  Reusable across diffeent DB models for functions to create, update or delete records
 */
export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };
