import express from "express";
import dotenv from "dotenv";
import db from "./config/connection.js";
import usersRouter from "./routes/users.js";
import tasksRouter from "./routes/tasks.js";
import projectsRouter from "./routes/projects.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({origin: process.env.FRONTEND_URL || 'http://localhost:5173'}));
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api", tasksRouter);
app.use("/api/projects", projectsRouter);

db.once("open", () => {
  app.listen(PORT, () => console.log(`Now listening on localhost:${PORT}`));
});
