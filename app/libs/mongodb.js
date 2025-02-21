import mongoose from "mongoose";

mongoose.set("strictQuery", false)

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.DB_COMPASS)
        console.log('Mongoose is connected');
        console.log("######################");
        console.log("###### DB PORFOLIO ######");
        console.log("######################");
    } catch (error) {
        console.error("Error conection to MongoDB", error)
    }
}

export default connectDB