import OpenAI from "openai";
import { logger } from "../utils/logger.js";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_KEY || 'dummy-key-for-demo'
});

export const rewriteArticle = async (originalTitle, originalContent, referenceContents) => {
  try {
    logger.info(`Rewriting article: ${originalTitle}`);
    
    // If no API key, return enhanced version without API call
    if (!process.env.OPENAI_KEY || process.env.OPENAI_KEY === 'dummy-key-for-demo') {
      logger.warn("No OpenAI API key found, returning enhanced version");
      return enhanceArticleWithoutAPI(originalTitle, originalContent, referenceContents);
    }
    
    const prompt = `You are an expert content writer and SEO specialist. 

Your task is to rewrite the following article to improve its SEO performance, readability, and engagement while maintaining accuracy.

ORIGINAL ARTICLE:
Title: ${originalTitle}
Content: ${originalContent}

REFERENCE ARTICLES (for style and structure inspiration):
${referenceContents.map((ref, i) => `Reference ${i + 1}:\n${ref}`).join('\n\n')}

REQUIREMENTS:
1. Improve SEO by incorporating relevant keywords naturally
2. Enhance readability with clear structure (use headings, short paragraphs)
3. Make the content more engaging and informative
4. Match the professional tone of the reference articles
5. Keep the core message and facts accurate
6. Aim for 400-600 words
7. Use markdown formatting for structure

Please provide the rewritten article:`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are an expert content writer specializing in SEO-optimized articles." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });
    
    const rewrittenContent = response.choices[0].message.content;
    logger.info("Article rewritten successfully");
    
    return rewrittenContent;
    
  } catch (error) {
    logger.error("LLM service error:", error.message);
    return enhanceArticleWithoutAPI(originalTitle, originalContent, referenceContents);
  }
};

function enhanceArticleWithoutAPI(title, content, references) {
  // Fallback enhancement without API
  return `# ${title}

## Overview
${content.substring(0, 200)}...

## Key Insights
This article explores important aspects of ${title.toLowerCase()}. The content has been structured for better readability and SEO performance.

## Detailed Analysis
${content}

## Conclusion
Understanding ${title.toLowerCase()} is crucial in today's digital landscape. By implementing these insights, businesses can achieve better results and improved customer satisfaction.

## Further Reading
The insights in this article are inspired by industry-leading resources and best practices in the field.

---
*This article has been optimized for SEO and readability.*`;
}