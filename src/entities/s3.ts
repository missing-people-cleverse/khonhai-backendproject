export interface UploadParams {
  Bucket: string;
  Body: string;
  Key: string;
  ContentType: string;
}

export interface deleteParams {
  Bucket: string;
  Key: string;
}

export interface getParams {
  Bucket: string;
  Key: string;
}
