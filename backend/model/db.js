import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/note-app`)
        console.log("database is connected")
    } catch (error) {
        console.log(error)
    }
}

export default connectDB;