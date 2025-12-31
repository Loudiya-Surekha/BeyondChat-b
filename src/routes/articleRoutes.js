import express from "express";
import {
  scrapeAndSave,
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  updateArticlesWithAI
} from "../controllers/articleController.js";

const router = express.Router();

// Scrape articles from BeyondChats
router.post("/scrape", scrapeAndSave);

// Update articles with AI
router.post("/update-with-ai", updateArticlesWithAI);

// CRUD operations
router.get("/", getArticles);
router.get("/:id", getArticleById);
router.post("/", createArticle);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;