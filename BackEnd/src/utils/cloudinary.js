import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { ApiError } from "./ApiError.js";


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        // console.log("file is uploaded on cloudinary ", response);
        fs.unlinkSync(localFilePath)
        console.log(localFilePath, 'localFilePath')
        return response;
      

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}
// const deletefileFromCloud=async(public_id)=>{
//     try {
//        if(!public_id){
//         throw new ApiError(400,"requied public ID")
//        } 
//        const deletefromC=await cloudinary.uploader.destroy(public_id, (error, result) => {
//         if (error) {
//           console.error('Error deleting image:', error.message);
//         } else {
//           return deletefromC;
//         }})
//     } catch (error) {
//         throw new ApiError(500,"unable to delete from cloud")
//     }
// }


export {uploadOnCloudinary}