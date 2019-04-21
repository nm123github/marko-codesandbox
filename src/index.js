
import express from "express";
import serveStatic from "serve-static";
import Home from "./pages/Home.marko";

const app = express();
const port = process.env.PORT || 8080;

app.use("/static", serveStatic("dist/client"));

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  Home.render({}, res);
});

app.listen(port);
