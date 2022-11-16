import cors from "cors";
import "dotenv/config";
import express from "express";
import { routes } from "./app/routes";
import { dbConnect } from "./configs/db.conn";
import { logger } from "./utils";

const serverApp = express();

serverApp.use(cors());
serverApp.use(express.json({ limit: "50mb" }));
serverApp.use(express.urlencoded({ extended: true }));

serverApp.get("/", (_req, res, next) => {
  res.json({ message: "server is running", date_time: new Date() });
  next();
});

serverApp.listen(process.env.SERVER_PORT, async () => {
  logger.info(`server is running on port ${process.env.SERVER_PORT}`);
  if (process.env.NODE_ENV !== "test") {
    dbConnect();
  }
  routes(serverApp);
});

export default serverApp;
