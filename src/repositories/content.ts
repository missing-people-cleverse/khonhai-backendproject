import { PrismaClient } from "@prisma/client";
import { IRepositoryContent } from ".";
import {
  IContent,
  ICreateContent,
  IDeleteContent,
  IUpdateContent,
} from "../entities";

export function newRepositoryContent(db: PrismaClient): IRepositoryContent {
  return new RepositoryContent(db);
}

class RepositoryContent implements IRepositoryContent {
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createContent(content: ICreateContent): Promise<IContent> {
    return await this.db.content.create({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      data: {
        ...content,
        userId: undefined,
        user: {
          connect: {
            id: content.userId,
          },
        },
      },
    });
  }

  async getContents(): Promise<IContent[]> {
    return await this.db.content.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async getContent(id: number): Promise<IContent | null> {
    return await this.db.content
      .findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      })
      .then((content) => {
        if (!content) {
          return Promise.reject(`content ${id} not found`);
        }
        return Promise.resolve(content);
      })
      .catch((err) => Promise.reject(`failed to get content ${id}: ${err}`));
  }

  //FE make condition to show Edit button
  async updateContent(id: number, content: IUpdateContent): Promise<IContent> {
    return await this.db.content.update({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      data: { ...content },
    });
  }

  async deleteContent(
    id: number,
    content: IDeleteContent
  ): Promise<IDeleteContent> {
    return await this.db.content.update({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      data: { ...content },
    });
  }
}
