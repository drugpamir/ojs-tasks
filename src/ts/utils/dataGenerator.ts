// import { randomUUID } from "crypto";

export function generateID(): string {
  return new Date().toString();
  //   return randomUUID();
}
