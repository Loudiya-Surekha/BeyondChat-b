import Article from "../models/Article.js";
import { searchGoogle, scrapeArticleContent } from "../services/googleSearch.js";
import { rewriteArticle } from "../services/llmService.js";
import { logger } from "../utils/logger.js";

export const runUpdate = async () => {
  try {
    logger.info("Starting article update process...");
    
    const articles = await Article.find({ updatedContent: { $exists: false } });
    
    if (articles.length === 0) {
      logger.info("No articles to update");
      return { success: true, message: "No articles to update", updated: 0 };
    }
    
    logger.info(`Found ${articles.length} articles to update`);
    let updatedCount = 0;
    
    for (const article of articles) {
      try {
        logger.info(`Processing: ${article.title}`);
        
        // Search Google for similar articles
        const searchLinks = await searchGoogle(article.title);
        
        if (searchLinks.length === 0) {
          logger.warn(`No search results for: ${article.title}`);
          continue;
        }
        
        // Scrape content from reference articles
        const referenceContents = [];
        for (const link of searchLinks) {
          const content = await scrapeArticleContent(link);
          if (content && content !== 'Content unavailable') {
            referenceContents.push(content);
          }
        }
        
        if (referenceContents.length === 0) {
          logger.warn(`No reference content scraped for: ${article.title}`);
          continue;
        }
        
        // Rewrite article using LLM
        const updatedContent = await rewriteArticle(
          article.title,
          article.content,
          referenceContents
        );
        
        // Update article in database
        article.updatedContent = updatedContent;
        article.references = searchLinks;
        article.updatedAt = new Date();
        await article.save();
        
        updatedCount++;
        logger.info(`✓ Updated: ${article.title}`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        logger.error(`Failed to update article ${article.title}:`, error.message);
      }
    }
    
    logger.info(`Article update complete. Updated ${updatedCount}/${articles.length} articles`);
    
    return {
      success: true,
      message: `Updated ${updatedCount} articles`,
      updated: updatedCount,
      total: articles.length
    };
    
  } catch (error) {
    logger.error("Update process error:", error.message);
    throw error;
  }
};