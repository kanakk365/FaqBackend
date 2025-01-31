import e from "express";
import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    translations: {
        type: Map,
        of: { question: String, answer: String },
        default: {}
    }
});

export default mongoose.model("Faq", FaqSchema);
