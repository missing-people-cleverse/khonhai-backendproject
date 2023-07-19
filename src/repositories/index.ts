import {
  IComment,
  IContent,
  ICreateComment,
  ICreateContent,
  ICreateUser,
  IDeleteContent,
  IUpdateComment,
  IUpdateContent,
  IUser,
} from "../entities";
import { IDeleteComment } from "./comment";

export interface IRepositoryUser {
  createUser(user: ICreateUser): Promise<IUser>;
  getUser(username: string): Promise<IUser>;
  getUserById(id: string): Promise<IUser>;
}

export interface IRepositoryBlacklist {
  addToBlacklist(token: string): Promise<void>;
  isBlacklist(token: string): Promise<boolean>;
}

export interface IRepositoryContent {
  createContent(content: ICreateContent): Promise<IContent>;
  getContents(): Promise<IContent[]>;
  getContent(id: number): Promise<IContent | null>;
  updateContent(id: number, content: IUpdateContent): Promise<IContent>;
  deleteContent(id: number, content: IDeleteContent): Promise<IDeleteContent>;
}

export interface IRepositoryComment {
  createComment(comment: ICreateComment): Promise<IComment>;
  getComments(): Promise<IComment[]>;
  updateComment(id: number, comment: IUpdateComment): Promise<IComment>;
  deleteComment(id: number, comment: IDeleteComment): Promise<IDeleteComment>;
}
