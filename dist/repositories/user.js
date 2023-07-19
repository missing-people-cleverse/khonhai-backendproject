"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryUser = void 0;
function newRepositoryUser(db) {
    return new RepositoryUser(db);
}
exports.newRepositoryUser = newRepositoryUser;
class RepositoryUser {
    constructor(db) {
        this.db = db;
    }
    async createUser(user) {
        return await this.db.user
            .create({ data: user })
            .catch((err) => Promise.reject(`failed to create user ${user.username}: ${err}`));
    }
    async getUser(username) {
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
    async getUserById(id) {
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
//# sourceMappingURL=user.js.map