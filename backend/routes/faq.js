import express from "express"
import { createFaq, getFaqs } from "../controllers/faq"

const router  = express.Router()

router.get("/faqs", getFaqs )
router.post("/faqs", createFaq )
router.put("/faqs/:id", updataFaq )
router.delete("/faqs/:id", deleteFaq )


export default router