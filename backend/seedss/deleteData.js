import mongoose from 'mongoose';
import dotenv from 'dotenv'
 import { dbConnect } from '../config/database.js';
import helpRequestModel from '../models/helpRequest.model.js';
import { Token } from '../models/token.model.js';
import fundraiserModel from '../models/fundraiser.model.js';
import { OTP } from '../models/otp.model.js';
import { Report } from '../models/report.model.js';
import { User } from '../models/user.model.js';
import ngoModel from '../models/ngo.model.js';
import Donation from "../models/donation.model.js"


dotenv.config()
    const deleteMessages = async () => {
        try {
            await dbConnect();  
            await Token.deleteMany({})
            await  helpRequestModel.deleteMany({})
            await fundraiserModel.deleteMany({})
            await Report.deleteMany({})
            await OTP.deleteMany({})
            await User.deleteMany({})
            await ngoModel.deleteMany({})
            await Donation.deleteMany({})
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
    