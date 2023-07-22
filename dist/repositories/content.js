"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryContent = void 0;
function newRepositoryContent(db) {
    return new RepositoryContent(db);
}
exports.newRepositoryContent = newRepositoryContent;
class RepositoryContent {
    constructor(db) {
        this.db = db;
    }
    async createContent(content) {
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
    async getContents() {
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
    async getContent(id) {
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
    // id Int @id @default(autoincrement())
    // contentId Int
    // content Content @relation(fields: [contentId], references: [id])
    // userId String
    // user User @relation(fields: [userId], references: [id])
    //FE make condition to show Edit button
    async updateContent(id, content) {
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
    async deleteContent(id, content) {
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
//# sourceMappingURL=content.js.map