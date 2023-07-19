"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerContent = void 0;
function newHandlerContent(repoContent) {
    return new HandlerContent(repoContent);
}
exports.newHandlerContent = newHandlerContent;
class HandlerContent {
    constructor(repo) {
        this.repo = repo;
    }
    async createContent(req, res) {
        const content = req.body;
        //user has to fill every details of content
        if (!content.ageLastSeen ||
            !content.dateOfBirth ||
            !content.gender ||
            !content.height ||
            !content.img ||
            !content.missingDatetime ||
            !content.missingDetail ||
            !content.name ||
            !content.nationality ||
            !content.nickname ||
            !content.place ||
            !content.province ||
            !content.remark ||
            !content.skin ||
            !content.status ||
            !content.surname ||
            !content.weight) {
            return res.status(400).json({ error: "missing information" }).end();
        }
        const userId = req.payload.id;
        return this.repo
            .createContent({ ...content, userId })
            .then((content) => res.status(201).json(content).end())
            .catch((err) => {
            console.error(`failed to create content: ${err}`);
            return res
                .status(500)
                .json({ error: `failed to create content: ${err}` })
                .end();
        });
    }
    async getContents(req, res) {
        return this.repo
            .getContents()
            .then((contents) => res.status(201).json(contents).end())
            .catch((err) => {
            console.error(`failed to get contents: ${err}`);
            return res
                .status(500)
                .json({ error: `failed to get contents : ${err}` })
                .end();
        });
    }
    async getContent(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id ${id} is not a number` })
                .end();
        }
        return this.repo
            .getContent(id)
            .then((content) => {
            if (!content) {
                return res.status(404).json(`no such content: ${id}`).end();
            }
            return res.status(201).json(content).end();
        })
            .catch((err) => {
            console.error(`failed to get content ${id}: ${err}`);
            return res
                .status(500)
                .json({ error: `failed to get content ${id}: ${err}` })
                .end();
        });
    }
    async updateContent(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id ${id} is not a number` })
                .end();
        }
        const content = req.body;
        //user has to fill every details of update content
        if (!content.ageLastSeen ||
            !content.dateOfBirth ||
            !content.gender ||
            !content.height ||
            !content.img ||
            !content.missingDatetime ||
            !content.missingDetail ||
            !content.missingDetail ||
            !content.name ||
            !content.nationality ||
            !content.nickname ||
            !content.place ||
            !content.province ||
            !content.remark ||
            !content.skin ||
            !content.status ||
            !content.surname ||
            !content.weight) {
            return res.status(400).json({ error: "missing information" }).end();
        }
        return this.repo
            .updateContent(id, { ...content })
            .then((updated) => res.status(201).json(updated).end())
            .catch((err) => {
            console.error(`failed to update content ${id}: ${err}`);
            return res
                .status(500)
                .json({ error: `failed to update content ${id}: ${err}` })
                .end();
        });
    }
    async deleteContent(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id ${id} is not a number` })
                .end();
        }
        const content = req.body;
        //user has to fill every details of delete content
        if (!content.isArchive || !content.status) {
            return res.status(400).json({ error: "missing information" }).end();
        }
        return this.repo
            .deleteContent(id, { ...content })
            .then((deleted) => res.status(201).json(deleted).end())
            .catch((err) => {
            console.error(`failed to delete content ${id}: ${err}`);
            return res
                .status(500)
                .json({ error: `failed to delete content ${id}: ${err}` })
                .end();
        });
    }
}
//# sourceMappingURL=content.js.map