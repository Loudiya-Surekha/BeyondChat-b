import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

connectDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
