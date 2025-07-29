import express from "express";
import dotenv from "dotenv";
import db from "./config/connection.js";
import usersRouter from "./routes/users.js";
import tasksRouter from "./routes/tasks.js";
import projectsRouter from "./routes/projects.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/projects", tasksRouter);
app.use("/api", projectsRouter);

db.once("open", () => {
  app.listen(PORT, () => console.log(`Now listening on localhost:${PORT}`));
});
