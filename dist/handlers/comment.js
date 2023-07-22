"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerComment = void 0;
function newHandlerComment(repoComment) {
    return new HandlerComment(repoComment);
}
exports.newHandlerComment = newHandlerComment;
class HandlerComment {
    constructor(repo) {
        this.repo = repo;
    }
    async createComment(req, res) {
        const comment = req.body;
        //check what requird
        if (!comment.foundDatetime ||
            !comment.foundDetail ||
            !comment.foundPlace ||
            !comment.img) {
            return res
                .status(400)
                .json({ error: "missing information", statusCode: 400 })
                .end();
        }
        const userId = req.payload.id;
        const contentId = Number(req.params.id);
        if (isNaN(contentId)) {
            return res
                .status(400)
                .json({ error: `id ${contentId} is not a number`, statusCode: 400 })
                .end();
        }
        return this.repo
            .createComment({ ...comment, userId, contentId })
            .then((comment) => res.status(201).json(comment).end())
            .catch((err) => {
            console.error(`failed to create comment: ${err}`);
            return res
                .status(500)
                .json({ error: `failed to create comment: ${err}`, statusCode: 500 })
                .end();
        });
    }
    async getComment(req, res) {
        const contentId = Number(req.params.id);
        if (isNaN(contentId)) {
            return res
                .status(400)
                .json({ error: `id ${contentId} is not a number`, statusCode: 400 })
                .end();
        }
        return this.repo
            .getComment(contentId)
            .then((comment) => res.status(201).json(comment).end())
            .catch((err) => {
            console.error(`failed to get comment: ${err}`);
            return res
                .status(500)
                .json({ error: `failed to get comment: ${err}`, statusCode: 500 })
                .end();
        });
    }
    async updateComment(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id ${id} is not a number`, statusCode: 400 })
                .end();
        }
        const comment = req.body;
        //user has to fill every details of update comment
        if (!comment.foundDatetime ||
            !comment.foundDetail ||
            !comment.foundPlace ||
            !comment.img) {
            return res
                .status(400)
                .json({ error: "missing information", statusCode: 400 })
                .end();
        }
        return this.repo
            .updateComment(id, { ...comment })
            .then((updated) => res.status(201).json(updated).end())
            .catch((err) => {
            console.error(`failed to update comment ${id}: ${err}`);
            return res
                .status(500)
                .json({
                error: `failed to update comment ${id}: ${err}`,
                statusCode: 500,
            })
                .end();
        });
    }
    //comment Archive
    async deleteComment(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id ${id} is not a number`, statusCode: 400 })
                .end();
        }
        const comment = req.body;
        //user has to fill every details of delete conmment
        if (!comment.isArchive) {
            return res
                .status(400)
                .json({ error: "missing information", statusCode: 400 })
                .end();
        }
        return this.repo
            .deleteComment(id, { ...comment })
            .then((deleted) => res.status(201).json(deleted).end())
            .catch((err) => {
            console.error(`failed to delete comment ${id}: ${err}`);
            return res
                .status(500)
                .json({
                error: `failed to delete comment ${id}: ${err}`,
                statusCode: 500,
            })
                .end();
        });
    }
}
//# sourceMappingURL=comment.js.map