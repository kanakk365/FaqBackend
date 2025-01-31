import connectDB from "./utils/db.js";
import express from "express";
import cors from "cors"
import dotenv from "dotenv"

dotenv.config({});




const app = express()

app.use(cors())
app.use(express.json());


// app.use("/api/v1/faqs" , )

const PORT = process.env.PORT || 3000


app.listen(PORT , ()=>{
    connectDB(),
    console.log(`Server is running at port ${PORT} ` )
})
