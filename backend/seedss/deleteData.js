import mongoose from 'mongoose';
import dotenv from 'dotenv'
 import { dbConnect } from '../config/database.js';
import helpRequestModel from '../models/helpRequest.model.js';
import { Token } from '../models/token.model.js';
import fundraiserModel from '../models/fundraiser.model.js';
import { Report } from '../models/report.model.js';
import { OTP } from '../models/otp.model.js';
import helpRequestModel from '../models/helpRequest.model.js';


dotenv.config()
    const deleteMessages = async () => {
        try {
            await dbConnect();  
            await Token.deleteMany({})
            .then(() => {
                console.log('All requests have been deleted successfully.');
                mongoose.disconnect();
            })
            .catch((error) => {
              console.error('Error deleting messages:', error);
              mongoose.disconnect();
            });
            console.log("Requests deleted successfully");
        } catch (error) {
            console.error("Error deleting database:", error);
        }
    };
    deleteMessages()
    // Call the function
    export {deleteMessages};
    