import { S3 } from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const bucketName = (process.env.AWS_BUCKET_NAME as string) ?? "khonhai-bucket";
const region = (process.env.AWS_BUCKET_REGION as string) ?? "ap-southeast-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;

const s3 = new S3({
  accessKeyId,
  secretAccessKey,
});

export { s3, bucketName, region };
