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
            return res.status(400).json({ error: "missing information" }).end();
        }
        const userId = req.payload.id;
        const contentId = Number(req.params.id);
        if (isNaN(contentId)) {
            return res
                .status(400)
                .json({ error: `id ${contentId} is not a number` })
                .end();
        }
        return this.repo
            .createComment({ ...comment, userId, contentId })
            .then((comment) => res.status(201).json(comment).end())
            .catch((err) => {
            console.error(`failed to create comment: ${err}`);
            return res
                .status(500)
                .json({ error: `failed to create comment: ${err}` })
                .end();
        });
    }
    // unused
    async getComments(req, res) {
        return this.repo
            .getComments()
            .then((comments) => res.status(201).json(comments).end())
            .catch((err) => {
            console.error(`failed to get comments: ${err}`);
            return res
                .status(500)
                .json({ error: `failed to get comments: ${err}` })
                .end();
        });
    }
    async updateComment(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id ${id} is not a number` })
                .end();
        }
        const comment = req.body;
        //user has to fill every details of update comment
        if (!comment.foundDatetime ||
            !comment.foundDetail ||
            !comment.foundPlace ||
            !comment.img) {
            return res.status(400).json({ error: "missing information" }).end();
        }
        return this.repo
            .updateComment(id, { ...comment })
            .then((updated) => res.status(201).json(updated).end())
            .catch((err) => {
            console.error(`failed to update comment ${id}: ${err}`);
            return res
                .status(500)
                .json({ error: `failed to update comment ${id}: ${err}` })
                .end();
        });
    }
    async deleteComment(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id ${id} is not a number` })
                .end();
        }
        const comment = req.body;
        //user has to fill every details of delete conmment
        if (!comment.isArchive) {
            return res.status(400).json({ error: "missing information" }).end();
        }
        return this.repo
            .deleteComment(id, { ...comment })
            .then((deleted) => res.status(201).json(deleted).end())
            .catch((err) => {
            console.error(`failed to delete comment ${id}: ${err}`);
            return res
                .status(500)
                .json({ error: `failed to delete comment ${id}: ${err}` })
                .end();
        });
    }
}
//# sourceMappingURL=comment.js.map