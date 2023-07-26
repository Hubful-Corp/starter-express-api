import http from "http";
import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import requestIp from "request-ip";

import router from "./src/routes";
import { connectDatabase } from "./src/configs/db";
import environment from "./src/configs";

var app = express();
app.use(cors());
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(requestIp.mw());
const httpServer = new http.Server(app);
app.use("/", router);
connectDatabase();

const port = environment.port || 5000;
httpServer.listen(port, () => console.log(`Server started on ${port}`));
