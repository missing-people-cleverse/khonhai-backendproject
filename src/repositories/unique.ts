import { RedisClientType } from "redis";

export function newRepositoryBlacklistUnique(
  db: RedisClientType<any, any, any>
): IRepositoryBlacklistUnique {
  return new RepositoryUnique(db);
}

export interface IRepositoryBlacklistUnique {
  addToBlacklistUsername(username: string): Promise<void>;
  isBlacklistUsername(username: string): Promise<boolean>;
  addToBlacklistEmail(email: string): Promise<void>;
  isBlacklistEmail(email: string): Promise<boolean>;
  addToBlacklistPhoneNumber(phoneNumber: string): Promise<void>;
  isBlacklistPhoneNumber(phoneNumber: string): Promise<boolean>;
}

const keyUsername = "username";
const keyEmail = "email";
const keyPhoneNumber = "phoneNumber";

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

  async addToBlacklistEmail(email: string): Promise<void> {
    await this.db.sAdd(keyEmail, email);
  }

  async isBlacklistEmail(email: string): Promise<boolean> {
    return this.db.sIsMember(keyEmail, email);
  }

  async addToBlacklistPhoneNumber(phoneNumber: string): Promise<void> {
    await this.db.sAdd(keyPhoneNumber, phoneNumber);
  }

  async isBlacklistPhoneNumber(phoneNumber: string): Promise<boolean> {
    return this.db.sIsMember(keyPhoneNumber, phoneNumber);
  }
}
