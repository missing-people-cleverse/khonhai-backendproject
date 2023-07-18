import { Response } from "express";
import {
  Empty,
  IHandlerContent,
  WithContent,
  WithContentId,
  WithContentUpdate,
} from ".";
import { JwtAuthRequest } from "../auth/jwt";
import { IRepositoryContent } from "../repositories";

export function newHandlerContent(
  repoContent: IRepositoryContent
): IHandlerContent {
  return new HandlerContent(repoContent);
}

class HandlerContent implements IHandlerContent {
  private repo: IRepositoryContent;

  constructor(repo: IRepositoryContent) {
    this.repo = repo;
  }

  async createContent(
    req: JwtAuthRequest<Empty, WithContent>,
    res: Response
  ): Promise<Response> {
    const content: WithContent = req.body;

    //check what requird
    if (
      !content.ageLastSeen
      // !content.dateOfBirth ||
      // !content.gender ||
      // !content.height ||
      // !content.img ||
      // !content.isArchive ||
      // !content.missingDatetime ||
      // !content.missingDetail ||
      // !content.name ||
      // !content.nationality ||
      // !content.nickname ||
      // !content.place ||
      // !content.province ||
      // !content.remark ||
      // !content.skin ||
      // !content.status ||
      // !content.surname ||
      // !content.weight
    ) {
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
          .json({ error: `failed to create content` })
          .end();
      });
  }

  async getContents(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response> {
    return this.repo
      .getContents()
      .then((contents) => res.status(201).json(contents).end())
      .catch((err) => {
        console.error(`failed to get contents: ${err}`);
        return res.status(500).json({ error: `failed to get contents` }).end();
      });
  }

  async getContent(
    req: JwtAuthRequest<WithContentId, WithContent>,
    res: Response
  ): Promise<Response> {
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

  async updateContent(
    req: JwtAuthRequest<WithContentId, WithContentUpdate>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${id} is not a number` })
        .end();
    }

    const content: WithContent = req.body;

    //check what requird
    if (
      !content.ageLastSeen ||
      !content.dateOfBirth ||
      !content.gender ||
      !content.height ||
      !content.img ||
      !content.isArchive ||
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
      !content.weight
    ) {
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
}
