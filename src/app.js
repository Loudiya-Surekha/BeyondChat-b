import express from "express";
import cors from "cors";
import articleRoutes from "./routes/articleRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/articles", articleRoutes);

export default app;
