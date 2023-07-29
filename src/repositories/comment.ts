import { PrismaClient } from "@prisma/client";
import {
  IComment,
  ICreateComment,
  IDeleteComment,
  IUpdateComment,
} from "../entities";
import { IRepositoryComment } from ".";

export function newRepositoryComment(db: PrismaClient): IRepositoryComment {
  return new RepositoryComment(db);
}

class RepositoryComment implements IRepositoryComment {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createComment(comment: ICreateComment): Promise<IComment> {
    return await this.db.comment.create({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            surname: true,
          },
        },
        content: {
          select: {
            id: true,
          },
        },
      },
      data: {
        ...comment,
        userId: undefined,
        contentId: undefined,
        user: {
          connect: {
            id: comment.userId,
          },
        },
        content: {
          connect: {
            id: comment.contentId,
          },
        },
      },
    });
  }

  async getComment(id: number): Promise<IComment[]> {
    return await this.db.comment.findMany({
      where: { contentId: id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            surname: true,
            email: true,
            phoneNumber: true,
            address: true,
            province: true,
            postcode: true,
          },
        },
      },
    });
  }

  async updateComment(id: number, comment: IUpdateComment): Promise<IComment> {
    return await this.db.comment.update({
      where: { id },
      data: { ...comment },
    });
  }

  //comment Archive
  async deleteComment(
    id: number,
    comment: IDeleteComment
  ): Promise<IDeleteComment> {
    return await this.db.comment.update({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            surname: true,
          },
        },
        content: {
          select: {
            id: true,
          },
        },
      },
      data: { ...comment },
    });
  }
}
