import { runApp } from "./ts/app";

const app = document.querySelector(".app");
if (app) {
  runApp(app);
} else {
  throw new Error("Can't found root element");
}
