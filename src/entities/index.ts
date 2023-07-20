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
  dateOfBirth: Date;
  gender: string;
  weight: number;
  height: number;
  skin: string;
  remark: string;
  status: string;
  province: string;
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
  nationality: string;
  ageLastSeen: number;
  dateOfBirth: Date;
  gender: string;
  weight: number;
  height: number;
  skin: string;
  remark: string;
  status: string;
  province: string;
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
  status: string;
}

export interface IDeleteComment {
  isArchive: boolean;
}
