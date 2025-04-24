import cloudinary from "cloudinary"
export const uploadImageToCloudinary = async (file, folder, quality, height) => {
  const options = {
    folder,
    resource_type: "auto"
  };
  if (quality) options.quality = quality
  if (height) options.height = height
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
