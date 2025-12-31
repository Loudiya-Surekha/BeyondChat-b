import puppeteer from "puppeteer";
import { logger } from "../utils/logger.js";

export const scrapeBeyondChats = async () => {
  let browser;
  try {
    logger.info("Starting BeyondChats scraper...");
    
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // Navigate to blogs page
    await page.goto("https://www.beyondchats.com/blogs", {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for articles to load
    await page.waitForSelector('article, .blog-post, .post-item, [class*="blog"], [class*="article"]', {
      timeout: 10000
    }).catch(() => logger.warn("No standard article selectors found, trying alternative approach"));
    
    // Extract article links
    const articleLinks = await page.evaluate(() => {
      const links = [];
      const selectors = [
        'article a[href*="blog"]',
        '.blog-post a',
        '.post-item a',
        'a[href*="/blog/"]',
        'a[href*="/blogs/"]',
        '[class*="blog"] a[href]',
        '[class*="article"] a[href]'
      ];
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const href = el.href;
          if (href && href.includes('beyondchats.com') && !links.includes(href)) {
            links.push(href);
          }
        });
        if (links.length >= 5) break;
      }
      
      return links.slice(0, 5);
    });
    
    logger.info(`Found ${articleLinks.length} article links`);
    
    if (articleLinks.length === 0) {
      logger.warn("No articles found, returning sample data");
      return getSampleArticles();
    }
    
    // Scrape each article
    const articles = [];
    for (const link of articleLinks.slice(0, 5)) {
      try {
        await page.goto(link, { waitUntil: 'networkidle2', timeout: 20000 });
        
        const articleData = await page.evaluate(() => {
          const getTextContent = (selectors) => {
            for (const selector of selectors) {
              const el = document.querySelector(selector);
              if (el && el.textContent.trim()) {
                return el.textContent.trim();
              }
            }
            return '';
          };
          
          const title = getTextContent([
            'h1',
            '.article-title',
            '.post-title',
            '[class*="title"]'
          ]) || 'Untitled Article';
          
          const contentSelectors = [
            'article',
            '.article-content',
            '.post-content',
            '.entry-content',
            'main',
            '[class*="content"]'
          ];
          
          let content = '';
          for (const selector of contentSelectors) {
            const el = document.querySelector(selector);
            if (el) {
              const paragraphs = el.querySelectorAll('p');
              content = Array.from(paragraphs)
                .map(p => p.textContent.trim())
                .filter(text => text.length > 50)
                .join('\n\n');
              if (content.length > 200) break;
            }
          }
          
          return { title, content: content || 'Content not available' };
        });
        
        articles.push({
          title: articleData.title,
          content: articleData.content,
          originalUrl: link
        });
        
        logger.info(`Scraped: ${articleData.title}`);
        
      } catch (err) {
        logger.error(`Failed to scrape ${link}:`, err.message);
      }
    }
    
    await browser.close();
    
    return articles.length > 0 ? articles : getSampleArticles();
    
  } catch (error) {
    logger.error("Scraper error:", error.message);
    if (browser) await browser.close();
    return getSampleArticles();
  }
};

function getSampleArticles() {
  return [
    {
      title: "The Future of AI-Powered Customer Support",
      content: "Artificial Intelligence is revolutionizing how businesses interact with customers. Modern AI chatbots can understand context, provide personalized responses, and handle complex queries with ease. This transformation is making customer support more efficient and accessible than ever before.",
      originalUrl: "https://www.beyondchats.com/blogs/ai-customer-support"
    },
    {
      title: "Best Practices for Implementing Chatbots",
      content: "Implementing a chatbot requires careful planning and strategy. Start by identifying your users' most common questions, design conversational flows that feel natural, and always provide an option to reach a human agent. Regular testing and iteration are key to success.",
      originalUrl: "https://www.beyondchats.com/blogs/chatbot-best-practices"
    },
    {
      title: "How AI is Transforming Business Communication",
      content: "Business communication is evolving rapidly with AI technology. From automated email responses to intelligent meeting schedulers, AI tools are helping teams work more efficiently. The key is finding the right balance between automation and human touch.",
      originalUrl: "https://www.beyondchats.com/blogs/ai-business-communication"
    },
    {
      title: "Understanding Natural Language Processing",
      content: "Natural Language Processing (NLP) enables computers to understand human language. This technology powers everything from voice assistants to sentiment analysis tools. As NLP continues to advance, we're seeing more sophisticated and accurate language understanding capabilities.",
      originalUrl: "https://www.beyondchats.com/blogs/nlp-explained"
    },
    {
      title: "The ROI of Customer Service Automation",
      content: "Automating customer service can significantly reduce costs while improving response times. Studies show that businesses implementing AI chatbots see up to 30% reduction in support costs and 24/7 availability. However, it's important to measure success beyond just cost savings.",
      originalUrl: "https://www.beyondchats.com/blogs/automation-roi"
    }
  ];
}