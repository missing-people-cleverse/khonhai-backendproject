import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { UploadParams, deleteParams, getParams } from "../entities/s3";

dotenv.config();

// link to env
const bucketName = (process.env.AWS_BUCKET_NAME as string) ?? "khonhai-bucket";
const region = (process.env.AWS_BUCKET_REGION as string) ?? "ap-southeast-1";
const accessKeyId = process.env.AWS_ACCESS_KEY as string;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export function uploadFile(
  fileBuffer: string,
  key: string,
  mimetype: string
): Promise<PutObjectCommandOutput> {
  const uploadParams: UploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: key,
    ContentType: mimetype,
  };

  return s3Client.send(new PutObjectCommand(uploadParams));
}

export function deleteFile(key: string): Promise<DeleteObjectCommandOutput> {
  const deleteParams: deleteParams = {
    Bucket: bucketName,
    Key: key,
  };

  return s3Client.send(new DeleteObjectCommand(deleteParams));
}

export async function getObjectSignedUrl(key: string): Promise<string> {
  const getParams: getParams = {
    Bucket: bucketName,
    Key: key,
  };

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand(getParams);
  const seconds = 60;
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

  return url;
}

export { bucketName, region, s3Client };
