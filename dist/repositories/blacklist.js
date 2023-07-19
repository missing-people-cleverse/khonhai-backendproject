"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryBlacklist = void 0;
function newRepositoryBlacklist(db) {
    return new RepositoryBlacklist(db);
}
exports.newRepositoryBlacklist = newRepositoryBlacklist;
const keyBlacklist = "blacklist";
class RepositoryBlacklist {
    constructor(db) {
        this.db = db;
    }
    async addToBlacklist(token) {
        await this.db.sAdd(keyBlacklist, token);
    }
    async isBlacklist(token) {
        return this.db.sIsMember(keyBlacklist, token);
    }
}
//# sourceMappingURL=blacklist.js.map