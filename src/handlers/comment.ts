import { IRepositoryComment } from "../repositories";
import { JwtAuthRequest } from "../auth/jwt";
import {
  Empty,
  IHandlerComment,
  WithComment,
  WithCommentDelete,
  WithCommentId,
  WithCommentUpdate,
  WithContentId,
} from ".";
import { Response } from "express";

export function newHandlerComment(
  repoComment: IRepositoryComment
): IHandlerComment {
  return new HandlerComment(repoComment);
}

class HandlerComment {
  private repo: IRepositoryComment;

  constructor(repo: IRepositoryComment) {
    this.repo = repo;
  }

  async createComment(
    req: JwtAuthRequest<WithContentId, WithComment>,
    res: Response
  ): Promise<Response> {
    const comment: WithComment = req.body;

    //check what requird
    if (
      !comment.foundDatetime ||
      !comment.foundDetail ||
      !comment.foundPlace ||
      !comment.img
    ) {
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

  // unused
  async getComments(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response> {
    return this.repo
      .getComments()
      .then((comments) => res.status(201).json(comments).end())
      .catch((err) => {
        console.error(`failed to get comments: ${err}`);
        return res
          .status(500)
          .json({ error: `failed to get comments: ${err}`, statusCode: 500 })
          .end();
      });
  }

  async updateComment(
    req: JwtAuthRequest<WithCommentId, WithCommentUpdate>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${id} is not a number`, statusCode: 400 })
        .end();
    }

    const comment: WithComment = req.body;

    //user has to fill every details of update comment
    if (
      !comment.foundDatetime ||
      !comment.foundDetail ||
      !comment.foundPlace ||
      !comment.img
    ) {
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
  async deleteComment(
    req: JwtAuthRequest<WithCommentId, WithCommentDelete>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${id} is not a number` })
        .end();
    }

    const comment: WithCommentDelete = req.body;

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
