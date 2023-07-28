import { Response } from "express";
import {
  Empty,
  IHandlerContent,
  WithContent,
  WithContentDelete,
  WithContentId,
  WithContentUpdate,
} from ".";
import { JwtAuthRequest } from "../auth/jwt";
import { IRepositoryContent } from "../repositories";
import crypto from "crypto";
import { bucketName, deleteFile, region, uploadFile } from "../services/s3";

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
    const content: WithContent = {
      ...req.body,
      weight: Number(req.body.weight),
      height: Number(req.body.height),
      ageLastSeen: Number(req.body.ageLastSeen),
    };

    // const keyInfo = [
    //   "ageLastSeen",
    //   "dateOfBirth",
    //   "gender",
    //   "height",
    //   "img",
    //   "missingDatetime",
    //   "missingDetail",
    //   "name",
    //   "nationality",
    //   "nickname",
    //   "place",
    //   "province",
    //   "remark",
    //   "skin",
    //   "status",
    //   "surname",
    //   "weight",
    // ];
    // console.log(keyInfo);

    // const checkInfo = keyInfo.every(
    //   (check) => content[check] !== undefined && content[check] !== null
    // );
    // console.log(checkInfo);

    // if (!checkInfo) {
    //   return res.status(400).json({ error: "missing information" }).end();
    // }

    if (
      !content.ageLastSeen ||
      !content.dateOfBirth ||
      !content.gender ||
      !content.height ||
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
      !content.weight
    ) {
      return res
        .status(400)
        .json({ error: "missing information", statusCode: 400 })
        .end();
    }
    const userId = req.payload.id;

    const files: any = req.files;
    console.log("files", files);
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

    return this.repo
      .createContent({ ...content, userId, img: imgUrls })
      .then((content) => res.status(201).json(content).end())
      .catch((err) => {
        console.error(`failed to create content: ${err}`);
        return res
          .status(500)
          .json({ error: `failed to create content: ${err}`, statusCode: 500 })
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
        return res
          .status(500)
          .json({ error: `failed to get contents : ${err}`, statusCode: 500 })
          .end();
      });
  }

  async getContent(
    req: JwtAuthRequest<WithContentId, Empty>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${id} is not a number`, statusCode: 400 })
        .end();
    }

    return this.repo
      .getContent(id)
      .then((content) => {
        if (!content) {
          return res
            .status(404)
            .json({ error: `no such content: ${id}`, statusCode: 404 })
            .end();
        }
        return res.status(201).json(content).end();
      })
      .catch((err) => {
        console.error(`failed to get content ${id}: ${err}`);
        return res
          .status(500)
          .json({
            error: `failed to get content ${id}: ${err}`,
            statusCode: 500,
          })
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
        .json({ error: `id ${id} is not a number`, statusCode: 400 })
        .end();
    }

    const content: WithContentUpdate = req.body;

    //user has to fill every details of update content
    if (
      !content.ageLastSeen ||
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
      !content.weight
    ) {
      return res
        .status(400)
        .json({ error: "missing information", statusCode: 400 })
        .end();
    }

    return this.repo
      .updateContent(id, { ...content })
      .then((updated) => res.status(201).json(updated).end())
      .catch((err) => {
        console.error(`failed to update content ${id}: ${err}`);
        return res
          .status(500)
          .json({
            error: `failed to update content ${id}: ${err}`,
            statusCode: 500,
          })
          .end();
      });
  }

  //content Archive
  async deleteContent(
    req: JwtAuthRequest<WithContentId, WithContentDelete>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${id} is not a number`, statusCode: 400 })
        .end();
    }

    const content: WithContentDelete = req.body;

    //user has to fill every details of delete content
    if (!content.isArchive || !content.status) {
      return res
        .status(400)
        .json({ error: "missing information", statusCode: 400 })
        .end();
    }
    // for (let i = 0; i < content.img.length; i++) {
    //   const url = content.img[i];
    //   const parts = url.split("/");
    //   const key = parts[parts.length - 1];
    //   await deleteFile(key);
    // }

    return this.repo
      .deleteContent(id, { ...content })
      .then((deleted) => res.status(201).json(deleted).end())
      .catch((err) => {
        console.error(`failed to delete content ${id}: ${err}`);
        return res
          .status(500)
          .json({
            error: `failed to delete content ${id}: ${err}`,
            statusCode: 500,
          })
          .end();
      });
  }
}
