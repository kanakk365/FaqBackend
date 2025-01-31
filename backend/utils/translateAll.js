import translateTextOpenAI from './translate.js';

const translateAll = async ({ question, answer }) => {
    const allTranslations = {};
    const languages = ['en', 'fr' , 'hi', 'bn','es', 'de']; 
  
    try {
      
      if (!question || typeof question !== 'string' || question.trim().length === 0) {
        throw new Error('Invalid question input');
      }
      if (!answer || typeof answer !== 'string' || answer.trim().length === 0) {
        throw new Error('Invalid answer input');
      }
  
     
      for (const lang of languages) {
        allTranslations[`question_${lang}`] = await translateTextOpenAI(question, lang);
        allTranslations[`answer_${lang}`] = await translateTextOpenAI(answer, lang);
      }
  
      return allTranslations;
    } catch (error) {
      console.error("Translation error:", error);
      throw new Error('Failed to translate content');
    }
  };
  
  export default translateAll;