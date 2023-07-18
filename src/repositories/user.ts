import { PrismaClient } from "@prisma/client";
import { ICreateUser, IUser } from "../entities";
import { IRepositoryUser } from ".";

export function newRepositoryUser(db: PrismaClient): IRepositoryUser {
  return new RepositoryUser(db);
}

class RepositoryUser implements IRepositoryUser {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createUser(user: ICreateUser): Promise<IUser> {
    return await this.db.user
      .create({ data: user })
      .catch((err) =>
        Promise.reject(`failed to create user ${user.username}: ${err}`)
      );
  }

  async getUser(username: string): Promise<IUser> {
    return await this.db.user
      .findUnique({ where: { username } })
      .then((user) => {
        if (!user) {
          return Promise.reject(`this user ${username} does not exist`);
        }
        return Promise.resolve(user);
      })
      .catch((err) => Promise.reject(`failed to get user ${username}: ${err}`));
  }

  async getUserById(id: string): Promise<IUser> {
    return await this.db.user
      .findUnique({ where: { id } })
      .then((user) => {
        if (!user) {
          return Promise.reject(`this user ${id} does not exist`);
        }
        return Promise.resolve(user);
      })
      .catch((err) => Promise.reject(`failed to get user ${id}: ${err}`));
  }
}
