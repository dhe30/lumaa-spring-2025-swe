import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import auth from "./routes/auth.ts";
import tasks from "./routes/tasks.ts";
import cookieParser from "cookie-parser";


const PORT = 5000;

dotenv.config()
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:5174'}));
app.use("/auth", auth)
app.use("/tasks", tasks)
app.listen(PORT, () => console.log("Server running on port 5000"));