import translate from "./translate.js";

const translateAll = async ({ question, answer }) => {
    const allTranslations = {};
    const languages = ['en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'hi', 'bn'];

    try {
        for (const lang of languages) {
            allTranslations[`question_${lang}`] = await translate(question, lang);
            allTranslations[`answer_${lang}`] = await translate(answer, lang);
        }
    } catch (error) {
        console.error("Translation error:", error);
    }

    return allTranslations;
};
export default translateAll;