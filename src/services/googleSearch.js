import puppeteer from "puppeteer";
import { logger } from "../utils/logger.js";

export const searchGoogle = async (query) => {
  let browser;
  try {
    logger.info(`Searching Google for: ${query}`);
    
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Extract search result links
    const links = await page.evaluate(() => {
      const results = [];
      const searchResults = document.querySelectorAll('div.g a[href^="http"]');
      
      searchResults.forEach(link => {
        const href = link.href;
        // Filter out Google's own links and non-article URLs
        if (href && 
            !href.includes('google.com') && 
            !href.includes('youtube.com') &&
            !href.includes('facebook.com') &&
            !href.includes('twitter.com') &&
            (href.includes('blog') || href.includes('article') || href.includes('.com'))) {
          results.push(href);
        }
      });
      
      return results;
    });
    
    await browser.close();
    
    const topLinks = links.slice(0, 2);
    logger.info(`Found ${topLinks.length} relevant links`);
    
    return topLinks.length > 0 ? topLinks : getDefaultReferences(query);
    
  } catch (error) {
    logger.error("Google search error:", error.message);
    if (browser) await browser.close();
    return getDefaultReferences(query);
  }
};

export const scrapeArticleContent = async (url) => {
  let browser;
  try {
    logger.info(`Scraping content from: ${url}`);
    
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    
    const content = await page.evaluate(() => {
      const selectors = [
        'article',
        '.article-content',
        '.post-content',
        '.entry-content',
        'main article',
        '[role="article"]',
        '.content'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          const paragraphs = element.querySelectorAll('p');
          const text = Array.from(paragraphs)
            .map(p => p.textContent.trim())
            .filter(t => t.length > 50)
            .join('\n\n');
          
          if (text.length > 200) {
            return text.substring(0, 2000); // Limit content length
          }
        }
      }
      
      return 'Content could not be extracted';
    });
    
    await browser.close();
    return content;
    
  } catch (error) {
    logger.error(`Failed to scrape ${url}:`, error.message);
    if (browser) await browser.close();
    return 'Content unavailable';
  }
};

function getDefaultReferences(query) {
  // Return some default reference URLs based on common topics
  return [
    `https://www.example.com/blog/${query.toLowerCase().replace(/\s+/g, '-')}`,
    `https://www.sample-blog.com/articles/${query.toLowerCase().replace(/\s+/g, '-')}`
  ];
}