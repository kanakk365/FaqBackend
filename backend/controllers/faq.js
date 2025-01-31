import mongoose from 'mongoose';
import translateAll from "../utils/translateAll.js";
import Faq from "../model/index.js";



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
    const validLangs = ['en', 'fr', 'es', 'de'];
    
    if (!validLangs.includes(lang)) {
      return res.status(400).json({ message: 'Invalid language code' });
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

    res.json({
      faqs: formattedFaqs,
      total: faqs.length
    });
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
  
      
      const sanitizedQuestion = question.trim();
      const sanitizedAnswer = answer.trim();
  
      
      const translatedData = await translateAll({ question: sanitizedQuestion, answer: sanitizedAnswer });
  
      
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
        translations
      });
  
      const savedFaq = await newFaq.save();
  
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







