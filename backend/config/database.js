import mongoose from "mongoose";
const dbConnect = async () => {
    try {
        //if you are making your environment variable in a root folder, then uncomment the below line a
        //dotenv.config({ path: '../.env' });
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Database connected successfully")
    }
    catch (error) {
        console.log("Db connection error");
        console.error(error);
        process.exit(1);
    }
}
export { dbConnect };