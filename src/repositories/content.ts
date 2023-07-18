import { PrismaClient } from "@prisma/client";
import { IRepositoryContent } from ".";
import { IContent, ICreateContent, IUpdateContent } from "../entities";

export function newRepositoryContent(db: PrismaClient): IRepositoryContent {
  return new RepositoryContent(db);
}

class RepositoryContent implements IRepositoryContent {
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createContent(content: ICreateContent): Promise<IContent> {
    return this.db.content.create({
      include: {
        user: {
          select: {
            id: true,
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
    return this.db.content.findMany({
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
    return this.db.content
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
      data: { ...content },
    });
  }

  //BE make condition that user can only edit own content
  // async updateUserContent(contentArg: {
  //   id: number;
  //   userId: string;
  //   newContent: IUpdateContent;
  // }): Promise<IUpdateContent> {
  //   const content = await this.db.content.findUnique({ where: { id: contentArg.id}})

  //   if(!content) {
  //     return Promise.reject(`no such todo ${contentArg.id}`)
  //   }

  //   if(content.userId !== contentArg.userId) {
  //     return Promise.reject(`bad userId: ${contentArg.userId}`)
  //   }

  //   return await this.db.content.update({
  //     where: { id: contentArg.id},
  //     data: { content: contentArg.newContent}
  //   })
  // }
}
