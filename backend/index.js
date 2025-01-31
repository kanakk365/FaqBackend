import connectDB from "./utils/db.js";
import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import router from "./routes/faq.js";

dotenv.config({});




const app = express()

app.use(cors())
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.use("/api/v1" , router )

const PORT = process.env.PORT || 3000


app.listen(PORT , ()=>{
    connectDB(),
    console.log(`Server is running at port ${PORT} ` )
})
export default app;