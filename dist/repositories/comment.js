"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryComment = void 0;
function newRepositoryComment(db) {
    return new RepositoryComment(db);
}
exports.newRepositoryComment = newRepositoryComment;
class RepositoryComment {
    constructor(db) {
        this.db = db;
    }
    async createComment(comment) {
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
    // unused
    async getComments() {
        return await this.db.comment.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        surname: true,
                    },
                },
                // content: {
                //   select: {
                //     id: true,
                //   },
                // },
            },
        });
    }
    async updateComment(id, comment) {
        return await this.db.comment.update({
            where: { id },
            data: { ...comment },
        });
    }
    async deleteComment(id, comment) {
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
//# sourceMappingURL=comment.js.map