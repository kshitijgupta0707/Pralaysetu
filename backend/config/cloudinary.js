
// Require the Cloudinary library
import cloudinary from 'cloudinary'

export const connectCloudinary = async () => {
  try {
    //establishing the connection with cloudinary
     await cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    console.log("Cloudinary connected");
  } catch (e) {
    console.error(e);
  }
};
