import mongoose from "mongoose";

const translationSchema = new mongoose.Schema({
    text: { 
        type: String, 
        required: true 
    }
});

const FaqSchema = new mongoose.Schema({
    question: { 
        type: String, 
        required: true 
    },
    answer: { 
        type: String, 
        required: true 
    },
    translations: {
        type: Object,
        default: {},
        validate: {
            validator: function(translations) {
                // Validate translation structure
                const validKeys = Object.keys(translations).every(key => 
                    key.startsWith('question_') || key.startsWith('answer_')
                );
                const validValues = Object.values(translations).every(val => 
                    val && typeof val.text === 'string'
                );
                return validKeys && validValues;
            },
            message: 'Invalid translation format'
        }
    }
}, { 
    timestamps: true 
});

export default mongoose.model("Faq", FaqSchema);