import mongoose from "mongoose";

export const connectDB = async() =>{
 try {
    const dbconnect = mongoose.connect(process.env.MONGODB_URL,)
    console.log(`MongoDB Connected: ${dbconnect.connection.host}`);
 } catch (err) {
    console.error(`Error in Database: ${err.message}`);
		process.exit(1);
 }
}