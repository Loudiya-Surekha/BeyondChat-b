import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  originalUrl: String,
  updatedContent: String,
  references: [String],
}, { timestamps: true });

export default mongoose.model("Article", articleSchema);
