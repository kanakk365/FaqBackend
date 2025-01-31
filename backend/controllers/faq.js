import translateText from "../utils/translate";
import translateAll from "../utils/translateAll";
import Faq from "../model/index.js";



const getFaqs = async (req, res) => {
    try {
        
        const language = req.query.language || 'en';
        
        
        const faqs = await Faq.find();

       
        const translatedFaqs = faqs.map(faq => {
            
            const translation = faq.translations[language];
            
           
            return translation
                ? { question: translation.question, answer: translation.answer }
                : { question: faq.question, answer: faq.answer }; 
        });

        res.status(200).json({
            faqs: translatedFaqs,
        });
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({
            message: "An error occurred while fetching the FAQs.",
            error: error.message,
        });
    }
};



const createFaq = async (req, res) => {
    try {
        // Get the question and answer from the request body
        const { question, answer } = req.body;

        // Create a new FAQ instance and save it
        const translations = await translateAll(req.body);

        const newFaq = new Faq({
            question,
            answer,
            translations// You can leave this empty or add default translations
        });

        await newFaq.save();

        res.status(201).json({
            message: 'FAQ created successfully!',
            faq: newFaq,
        });
    } catch (error) {
        console.error("Error creating FAQ:", error);
        res.status(500).json({
            message: "An error occurred while creating the FAQ.",
            error: error.message,
        });
    }
};




export { getFaqs, createFaq }