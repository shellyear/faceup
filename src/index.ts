import express from "express";
import "reflect-metadata";
import reportRouter, { reportRouterPath } from "./routes/report";
import { AppDataSource } from "./appDataSource";
import cors from "cors";
import fileRouter, { fileRouterPath } from "./routes/file";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const port = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.use(reportRouterPath, reportRouter);
    app.use(fileRouterPath, fileRouter);
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) =>
    console.error("Error during Data Source initialization:", error)
  );
