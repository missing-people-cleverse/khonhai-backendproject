export interface ICreateUser {
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: string;
  province: string;
  postcode: string;
}

export interface IUser extends ICreateUser {
  id: string;
  registeredAt: Date;
  updatedAt: Date;
}

export interface ICreateContent {
  userId: string;
  isArchive: boolean;
  name: string;
  surname: string;
  nickname: string;
  img: string;
  nationality: string;
  ageLastSeen: number;
  dateOfBirth: string;
  gender: string;
  weight: number;
  height: number;
  skin: string;
  remark: string;
  status: string;
  province: string;
  place: string;
  missingDatetime: string;
  missingDetail: string;
}

export interface IContent extends ICreateContent {
  id: number;
}

export interface IUpdateContent {
  isArchive: boolean;
  name: string;
  surname: string;
  nickname: string;
  img: string;
  nationality: string;
  ageLastSeen: number;
  dateOfBirth: string;
  gender: string;
  weight: number;
  height: number;
  skin: string;
  remark: string;
  status: string;
  province: string;
  place: string;
  missingDatetime: string;
  missingDetail: string;
}

export interface ICreateComment {
  contentId: number;
  userId: string;
  foundPlace: string;
  foundDatetime: string;
  foundDetail: string;
  img: string;
  isArchive: boolean;
}

export interface IComment extends ICreateComment {
  id: number;
}

export interface IUpdateComment {
  foundPlace: string;
  foundDatetime: string;
  foundDetail: string;
  img: string;
  isArchive: boolean;
}

export interface IDeleteContent {
  isArchive: boolean;
  status: string;
}

export interface IDeleteComment {
  isArchive: boolean;
}

// for s3
import dotenv from "dotenv";

dotenv.config();

export const config: {
  port: number;
  aws_access_key_id: string;
  aws_secret_access_key: string;
  bucket_name: string;
  aws_region: string;
} = {
  port: Number(process.env.PORT) ?? 8000,
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID ?? " ",
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  bucket_name: process.env.AWS_BUCKET ?? "khonhai-bucket",
  aws_region: process.env.AWS_BUCKET_REGION ?? "ap-southeast-1",
};
