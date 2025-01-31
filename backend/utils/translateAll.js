import translateTextOpenAI from "./translate.js";
import translate from "./translate.js";

const translateAll = async ({ question, answer }) => {
    const allTranslations = {};
    const languages = ['en', 'fr', ];
    // 'es',  'ru', 'ko', 'hi', 'bn', 'de', 'it', 'pt', 'zh', 'ja'

    try {
        for (const lang of languages) {
            allTranslations[`question_${lang}`] = await translateTextOpenAI(question, lang);
            allTranslations[`answer_${lang}`] = await translateTextOpenAI(answer, lang);
        }
    } catch (error) {
        console.error("Translation error:", error);
    }

    return allTranslations;
};
export default translateAll;