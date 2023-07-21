import {
  IComment,
  IContent,
  ICreateComment,
  ICreateContent,
  ICreateUser,
  IDeleteComment,
  IDeleteContent,
  IUpdateComment,
  IUpdateContent,
  IUser,
} from "../entities";

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
  getComment(id: number): Promise<IComment[]>;
  updateComment(id: number, comment: IUpdateComment): Promise<IComment>;
  deleteComment(id: number, comment: IDeleteComment): Promise<IDeleteComment>;
}
