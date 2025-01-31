import mongoose from "mongoose"

const connectDB= async()=>{
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI environment variable is not defined")
    }
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("database connected")
    } catch (error) {
        console.log(error)
    }
}

export default connectDB