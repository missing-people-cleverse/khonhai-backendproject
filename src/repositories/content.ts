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
  private db: PrismaClient;

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
            name: true,
            surname: true,
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
            name: true,
            surname: true,
          },
        },
        comments: {
          select: {
            id: true,
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
              name: true,
              surname: true,
              email: true,
              phoneNumber: true,
            },
          },
          comments: {
            select: {
              id: true,
              foundPlace: true,
              foundDatetime: true,
              foundDetail: true,
              img: true,
              isArchive: true,
              createdAt: true,
              updatedAt: true,
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

  async updateContent(id: number, content: IUpdateContent): Promise<IContent> {
    return await this.db.content.update({
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
      },
      data: { ...content },
    });
  }

  //content Archive
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
            name: true,
            surname: true,
          },
        },
      },
      data: { ...content },
    });
  }
}
