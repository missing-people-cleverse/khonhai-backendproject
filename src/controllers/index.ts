import { initBucket } from "../services";
import { S3 } from "aws-sdk";
import { Request } from "express";

import { uploadToS3 } from "../services/uploadToS3";
import { config } from "../entities/index";

// Yes! Now we can pass to the controller implementation, and with this part above, it will be pretty easy.

export class UploadController {
  static Upload = async (req: Request, res: any) => {
    const s3 = new S3({
      accessKeyId: config.aws_access_key_id,
      secretAccessKey: config.aws_secret_access_key,
    });

    // Initialize bucket
    await initBucket(s3);

    // get file data through req.file thank to multer
    console.log("file stobject", req.file);

    const uploadRes = await uploadToS3(s3, req.file);

    if (uploadRes.success) {
      res.status(200).json(uploadRes);
    } else {
      res.status(400).json(uploadRes);
    }
  };
}