import { S3 } from "aws-sdk";
import { CreateBucketRequest } from "aws-sdk/clients/s3";

import { config } from "../entities/index";

/*
 * @name createBucket
  * @param {S3} s3
  * @returns {Promise<{success:boolean; message: string; data: string;}>}
  createBucket: It’s also a function, but this one creates a bucket in Amazon S3 with the name provided in .env file in a specific region.
*/

export const createBucket = async (s3: S3) => {
  const params: CreateBucketRequest = {
    Bucket: config.bucket_name,
    CreateBucketConfiguration: {
      // Set your region here
      LocationConstraint: "ap-southeast-1",
    },
  };

  try {
    const res = await s3.createBucket(params).promise();

    console.log("Bucket Created Successfull", res.Location);

    return {
      success: true,
      message: "Bucket Created Successfull",
      data: res.Location,
    };
  } catch (error) {
    console.log("Error: Unable to create bucket \n", error);

    return { success: false, message: "Unable to create bucket", data: error };
  }
};
