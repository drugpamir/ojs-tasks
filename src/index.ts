import "./css/style.css";
import { runApp } from "./ts/app";

const app = document.querySelector(".app");
if (app) {
  runApp(app as HTMLElement);
} else {
  throw new Error("Can't found root element");
}
