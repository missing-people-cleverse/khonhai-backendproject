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
import crypto from "crypto";
import { bucketName, deleteFile, region, uploadFile } from "../services/s3";

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
    if (!comment.foundDatetime || !comment.foundDetail || !comment.foundPlace) {
      return res
        .status(400)
        .json({ error: "missing information", statusCode: 400 })
        .end();
    }

    const userId = req.payload.id;
    const contentId = Number(req.params.id);

    const files: any = req.files;
    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "No files uploaded", statusCode: 400 })
        .end();
    }

    const imgUrls: string[] = [];
    for (const file of files.photos) {
      const generateFileName = crypto.randomBytes(32).toString("hex");
      const img = generateFileName;
      const imgUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${img}`;
      await uploadFile(file.buffer, img, file.mimetype);
      imgUrls.push(imgUrl);
    }
    if (!imgUrls || imgUrls.length === 0) {
      return res
        .status(400)
        .json({ message: "No img urls", statusCode: 400 })
        .end();
    }

    if (isNaN(contentId)) {
      return res
        .status(400)
        .json({ error: `id ${contentId} is not a number`, statusCode: 400 })
        .end();
    }

    return this.repo
      .createComment({ ...comment, userId, contentId, img: imgUrls })
      .then((comment) => res.status(201).json(comment).end())
      .catch((err) => {
        console.error(`failed to create comment: ${err}`);
        return res
          .status(500)
          .json({ error: `failed to create comment: ${err}`, statusCode: 500 })
          .end();
      });
  }

  async getComment(
    req: JwtAuthRequest<WithContentId, Empty>,
    res: Response
  ): Promise<Response> {
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

  //comment Archive
  async deleteComment(
    req: JwtAuthRequest<WithCommentId, WithCommentDelete>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${id} is not a number`, statusCode: 400 })
        .end();
    }

    const comment: WithCommentDelete = req.body;

    //user has to fill every details of delete conmment
    if (!comment.isArchive) {
      return res
        .status(400)
        .json({ error: "missing information", statusCode: 400 })
        .end();
    }

    // for (let i = 0; i < comment.img.length; i++) {
    //   const url = comment.img[i];
    //   const parts = url.split("/");
    //   const key = parts[parts.length - 1];
    //   await deleteFile(key);
    // }

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
