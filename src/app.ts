import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { routes } from "./routes";
import { errorHandler } from "./common/middleware/error.middleware";

export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(pinoHttp());

app.use("/api", routes);

app.use(errorHandler);
