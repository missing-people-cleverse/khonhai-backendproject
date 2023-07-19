import { Gender, Nationality, Province, Skin, Status } from "@prisma/client";

export interface ICreateUser {
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: string;
  province: Province;
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
  nationality: Nationality;
  ageLastSeen: number;
  dateOfBirth: Date;
  gender: Gender;
  weight: number;
  height: number;
  skin: Skin;
  remark: string;
  status: Status;
  province: Province;
  place: string;
  missingDatetime: Date;
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
  nationality: Nationality;
  ageLastSeen: number;
  dateOfBirth: Date;
  gender: Gender;
  weight: number;
  height: number;
  skin: Skin;
  remark: string;
  status: Status;
  province: Province;
  place: string;
  missingDatetime: Date;
  missingDetail: string;
}

export interface ICreateComment {
  contentId: number;
  userId: string;
  foundPlace: string;
  foundDatetime: Date;
  foundDetail: string;
  img: string;
  isArchive: boolean;
}

export interface IComment extends ICreateComment {
  id: number;
}

export interface IUpdateComment {
  foundPlace: string;
  foundDatetime: Date;
  foundDetail: string;
  img: string;
  isArchive: boolean;
}

export interface IDeleteContent {
  isArchive: boolean;
  status: Status;
}
