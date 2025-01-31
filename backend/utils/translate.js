import { translate } from '@vitalets/google-translate-api';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function translateText(text, targetLang = 'en') {
    
    if (!text || typeof text !== 'string') {
        return "Invalid text input";
    }

    
    const validLangs = ['en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'hi', 'bn'];
    if (!validLangs.includes(targetLang)) {
        throw new Error('Invalid target language code');
    }

    try {
        const result = await translate(text, { 
            to: targetLang,
            fetchOptions: { timeout: 10000 }
        });
        return result.text;
    } catch (error) {
        console.error('Translation error:', error.message);
        throw new Error(`Translation failed: ${error.message}`);
    }
}

// // Test translation
// async function main() {
//     try {
//         const result = await translateText('Hello, world!', 'hi');
//         console.log('Translated text:', result);
//     } catch (error) {
//         console.error(error.message);
//     }
// }

// // Run if called directly
// if (import.meta.url === new URL(import.meta.url).href) {
//     main().catch(console.error);
// }

export default translateText;