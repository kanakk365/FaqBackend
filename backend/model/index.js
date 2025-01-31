import e from "express";
import translate from "google-translate-api";
import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema({
    question: {type: String, required: true},
    answer: {type: String, required: true},
    translations:{
        hi: { question: String, answer: String }, 
        bn: { question: String, answer: String }, 
    }
})

export default mongoose.model("Faq", FaqSchema)