import mongoose from "mongoose";

const translationSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true 
  },
  _id: { 
    type: mongoose.Schema.Types.ObjectId, 
    auto: true 
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
    type: Map, 
    of: translationSchema, 
    default: {} 
  }
}, { 
  timestamps: true
});

export default mongoose.model("Faq", FaqSchema);