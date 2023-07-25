import { S3 } from "aws-sdk";
import { checkBucket } from "./checkBucket";
import { createBucket } from "./createBucket";

import { config } from "../entities/index";

/**
 * @name initBucket
 * @returns {void}
 Before implementing the controller, we need a function that initializes the bucket.
 This function must before creating a bucket check if it exists.
 */
export const initBucket = async (s3: S3) => {
  const bucketStatus = await checkBucket(s3, config.bucket_name);

  if (!bucketStatus.success) {
    // check if the bucket don't exist
    let bucket = await createBucket(s3); // create new bucket
    console.log(bucket.message);
  }
};
