import { S3 } from "aws-sdk";
import fs from "fs";
// import bcryptjs from "bcryptjs";

import { config } from "../entities/index";

/*
 * @name uploadToS3
 * @param {S3} s3
 * @param {File} fileData
 * @returns {Promise<{success:boolean; message: string; data: object;}>}
 uploadToS3: That is the core function because the project logic is implemented there (uploading files to Amazon S3🧐).
 */

export const uploadToS3 = async (s3: S3, fileData?: Express.Multer.File) => {
  try {
    const fileContent = fs.readFileSync(fileData!.path);

    // function hashFileName(password: string): string {
    //   const salt = bcryptjs.genSaltSync(12);

    //   return bcryptjs.hashSync(password, salt);
    // }

    const params = {
      Bucket: config.bucket_name,
      Key: fileData!.originalname,
      Body: fileContent,
    };

    try {
      const res = await s3.upload(params).promise();

      console.log("File Uploaded with Successfull", res.Location);

      return {
        success: true,
        message: "File Uploaded with Successfull",
        data: res.Location,
      };
    } catch (error) {
      return {
        success: false,
        message: "Unable to Upload the file",
        data: error,
      };
    }
  } catch (error) {
    return { success: false, message: "Unable to access this file", data: {} };
  }
};
