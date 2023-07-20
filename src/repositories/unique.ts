import { RedisClientType } from "redis";

export function newRepositoryBlacklistUnique(
  db: RedisClientType<any, any, any>
): IRepositoryBlacklistUnique {
  return new RepositoryUnique(db);
}

export interface IRepositoryBlacklistUnique {
  addToBlacklistUsername(username: string): Promise<void>;
  isBlacklistUsername(username: string): Promise<boolean>;
}

const keyUsername = "username";

class RepositoryUnique implements IRepositoryBlacklistUnique {
  private db: RedisClientType<any, any, any>;

  constructor(db: RedisClientType<any, any, any>) {
    this.db = db;
  }

  async addToBlacklistUsername(username: string): Promise<void> {
    await this.db.sAdd(keyUsername, username);
  }

  async isBlacklistUsername(username: string): Promise<boolean> {
    return this.db.sIsMember(keyUsername, username);
  }
}
