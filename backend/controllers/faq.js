import mongoose from 'mongoose';
import translateAll from "../utils/translateAll.js";
import Faq from "../model/index.js";
import redisClient from '../utils/redisClient.js';


import sanitizeHtml from 'sanitize-html';


const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
  allowedAttributes: {
    '*': ['class', 'style', 'href', 'src', 'alt'],
    img: ['src', 'alt', 'width', 'height']
  }
};

const sanitizeContent = (html) => sanitizeHtml(html, sanitizeOptions);



const getFaqs = async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    

    const cacheKey = `faqs:${lang}`;

    
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log('Serving from cache');
      return res.json(JSON.parse(cachedData));
    }


    const faqs = await Faq.find().sort({ createdAt: -1 });

    const formattedFaqs = faqs.map(faq => ({
      id: faq._id,
      question: faq.translations.get(`question_${lang}`)?.text || faq.question,
      answer: faq.translations.get(`answer_${lang}`)?.text || faq.answer,
      createdAt: faq.createdAt,
      originalLanguage: 'en',
      requestedLanguage: lang
    }));

    const responseData = {
      faqs: formattedFaqs,
      total: faqs.length
    };

   
    await redisClient.set(cacheKey, JSON.stringify(responseData), {
      EX: 3600, 
    });

    console.log('Serving from database');
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ 
      message: 'Error fetching FAQs',
      error: error.message 
    });
  }
};


const createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    // Validate input
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ message: 'Question is required and must be a non-empty string' });
    }
    if (!answer || typeof answer !== 'string' || answer.trim().length === 0) {
      return res.status(400).json({ message: 'Answer is required and must be a non-empty string' });
    }

    // Sanitize input
    const sanitizedQuestion = question.trim();
    const sanitizedAnswer = answer.trim();

    // Translate content
    const translatedData = await translateAll({
      question: sanitizedQuestion,
      answer: sanitizedAnswer
    });

   
    const translations = new Map();
    Object.entries(translatedData).forEach(([key, translatedText]) => {
      translations.set(key, {
        text: translatedText,
        _id: new mongoose.Types.ObjectId()
      });
    });

    
    const newFaq = new Faq({
      question: sanitizedQuestion,
      answer: sanitizedAnswer,
      translations: translations
    });

    const savedFaq = await newFaq.save();

   
    const languages = ['en', 'fr', 'es', 'de'];
    for (const lang of languages) {
      await redisClient.del(`faqs:${lang}`);
    }

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      faq: {
        id: savedFaq._id,
        question: savedFaq.question,
        answer: savedFaq.answer,
        translations: Object.fromEntries(savedFaq.translations),
        createdAt: savedFaq.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating FAQ',
      error: error.message
    });
  }
};

const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    let { question, answer } = req.body;

    if (question) question = sanitizeContent(question);
    if (answer) answer = sanitizeContent(answer);

    const faq = await Faq.findById(id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    if (question) faq.question = question;
    if (answer) faq.answer = answer;

    if (question || answer) {
      const translatedData = await translateAll({ 
        question: faq.question, 
        answer: faq.answer 
      });

      const translations = new Map();
      Object.entries(translatedData).forEach(([key, translatedText]) => {
        translations.set(key, {
          text: sanitizeContent(translatedText)
        });
      });
      
      faq.translations = translations;
    }

    faq.updatedAt = Date.now();
    const updatedFaq = await faq.save();

    
    const languages = ['en', 'fr', 'es', 'de'];
    for (const lang of languages) {
      await redisClient.del(`faqs:${lang}`);
    }

    res.json({
      success: true,
      message: 'FAQ updated successfully',
      faq: {
        id: updatedFaq._id,
        question: updatedFaq.question,
        answer: updatedFaq.answer,
        translations: Object.fromEntries(updatedFaq.translations),
        updatedAt: updatedFaq.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating FAQ',
      error: error.message
    });
  }
};

const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'FAQ ID is required' });
    }

    const deletedFaq = await Faq.findByIdAndDelete(id);

    if (!deletedFaq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    
    const languages = ['en', 'fr', 'es', 'de'];
    for (const lang of languages) {
      await redisClient.del(`faqs:${lang}`);
    }

    res.json({
      success: true,
      message: 'FAQ deleted successfully',
      faq: {
        id: deletedFaq._id,
        question: deletedFaq.question,
        answer: deletedFaq.answer
      }
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting FAQ',
      error: error.message
    });
  }
};

export { getFaqs, createFaq, updateFaq, deleteFaq };







