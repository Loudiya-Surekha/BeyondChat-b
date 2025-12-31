import Article from "../models/Article.js";
import { scrapeBeyondChats } from "../services/scraper.js";
import { runUpdate } from "../scripts/updateArticles.js";
import { logger } from "../utils/logger.js";

export const scrapeAndSave = async (req, res) => {
  try {
    logger.info("Scraping articles from BeyondChats...");
    
    const articles = await scrapeBeyondChats();
    
    if (!articles || articles.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No articles found" 
      });
    }
    
    // Check for duplicates before saving
    const savedArticles = [];
    for (const article of articles) {
      const existing = await Article.findOne({ title: article.title });
      if (!existing) {
        const saved = await Article.create(article);
        savedArticles.push(saved);
      } else {
        logger.info(`Article already exists: ${article.title}`);
      }
    }
    
    logger.info(`Saved ${savedArticles.length} new articles`);
    
    res.json({ 
      success: true, 
      message: `Scraped and saved ${savedArticles.length} articles`,
      articles: savedArticles 
    });
    
  } catch (error) {
    logger.error("Scrape and save error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to scrape articles", 
      error: error.message 
    });
  }
};

export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json({ 
      success: true, 
      count: articles.length,
      articles 
    });
  } catch (error) {
    logger.error("Get articles error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch articles", 
      error: error.message 
    });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: "Article not found" 
      });
    }
    
    res.json({ 
      success: true, 
      article 
    });
    
  } catch (error) {
    logger.error("Get article by ID error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch article", 
      error: error.message 
    });
  }
};

export const createArticle = async (req, res) => {
  try {
    const { title, content, originalUrl } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: "Title and content are required" 
      });
    }
    
    const article = await Article.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      message: "Article created successfully",
      article 
    });
    
  } catch (error) {
    logger.error("Create article error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create article", 
      error: error.message 
    });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: "Article not found" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Article updated successfully",
      article 
    });
    
  } catch (error) {
    logger.error("Update article error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update article", 
      error: error.message 
    });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    
    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: "Article not found" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Article deleted successfully" 
    });
    
  } catch (error) {
    logger.error("Delete article error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete article", 
      error: error.message 
    });
  }
};

export const updateArticlesWithAI = async (req, res) => {
  try {
    logger.info("Starting AI update process...");
    
    const result = await runUpdate();
    
    res.json(result);
    
  } catch (error) {
    logger.error("Update articles with AI error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update articles", 
      error: error.message 
    });
  }
};