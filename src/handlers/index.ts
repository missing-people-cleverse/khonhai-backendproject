import { Request, Response } from "express";
import { JwtAuthRequest } from "../auth/jwt";

export interface AppRequest<Params, Body> extends Request<Params, any, Body> {}

export interface Empty {}

export interface WithUser {
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

export interface WithUserId {
  id: string;
}

export type HandlerFunc<Req> = (req: Req, res: Response) => Promise<Response>;
export interface IHandlerUser {
  register: HandlerFunc<AppRequest<Empty, WithUser>>;
  login: HandlerFunc<AppRequest<Empty, WithUser>>;
  getUserDetail(
    req: JwtAuthRequest<WithUserId, Empty>,
    res: Response
  ): Promise<Response>;
  logout(req: JwtAuthRequest<Empty, Empty>, res: Response): Promise<Response>;
}

export interface WithContentId {
  id: string;
}

export interface WithContent {
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

export interface WithContentUpdate {
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

export interface IHandlerContent {
  createContent: HandlerFunc<JwtAuthRequest<Empty, WithContent>>;
  getContents: HandlerFunc<JwtAuthRequest<Empty, Empty>>;
  getContent: HandlerFunc<JwtAuthRequest<WithContentId, Empty>>;
  updateContent: HandlerFunc<JwtAuthRequest<WithContentId, WithContentUpdate>>;
  deleteContent: HandlerFunc<JwtAuthRequest<WithContentId, WithContentDelete>>;
}

export interface WithComment {
  foundPlace: string;
  foundDatetime: Date;
  foundDetail: string;
  img: string;
  isArchive: boolean;
}

export interface WithCommentId {
  id: number;
}

export interface WithCommentUpdate {
  foundPlace: string;
  foundDatetime: Date;
  foundDetail: string;
  img: string;
  isArchive: boolean;
}

export interface IHandlerComment {
  createComment: HandlerFunc<JwtAuthRequest<WithContentId, WithComment>>;
  getComments: HandlerFunc<JwtAuthRequest<Empty, Empty>>;
  updateComment: HandlerFunc<JwtAuthRequest<WithCommentId, WithCommentUpdate>>;
  deleteComment: HandlerFunc<JwtAuthRequest<WithCommentId, WithCommentDelete>>;
}

export interface WithContentDelete {
  isArchive: boolean;
  status: string;
}

export interface WithCommentDelete {
  isArchive: boolean;
}
