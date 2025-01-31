// utils/translate.js
import { OpenAI } from 'openai';
import * as cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import dotevn from 'dotenv';

dotevn.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
  allowedAttributes: {
    '*': ['class', 'style', 'href', 'src', 'alt'],
    img: ['src', 'alt', 'width', 'height']
  }
};

async function translateHTMLContent(html, targetLang) {
  try {
    const $ = cheerio.load(html);
    const textNodes = [];

    
    $('*').contents().each(function () {
      if (this.type === 'text' && this.data.trim().length > 0) {
        textNodes.push(this);
      }
    });

    
    for (const node of textNodes) {
      const originalText = $(node).text();
      const translatedText = await translateTextOpenAI(originalText, targetLang);
      $(node).replaceWith(translatedText);
    }

    return $.html();
  } catch (error) {
    console.error('Error translating HTML content:', error);
    throw error;
  }
}

async function translateTextOpenAI(text, targetLang = 'en') {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Invalid text input: Text must be a non-empty string');
    }
  
    const validLangs = ['en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'hi', 'bn'];
    if (!validLangs.includes(targetLang)) {
      throw new Error(`Invalid target language code: ${targetLang}`);
    }
  
    try {
      const isHTML = /<[a-z][\s\S]*>/i.test(text);
  
      if (isHTML) {
        const sanitizedHTML = sanitizeHtml(text, sanitizeOptions);
        return await translateHTMLContent(sanitizedHTML, targetLang);
      } else {
        const prompt = `Translate the following text to ${targetLang}: "${text}"`;
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
        });
        return response.choices[0].message.content.trim();
      }
    } catch (error) {
      console.error('Translation error:', error.message);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

export default translateTextOpenAI;