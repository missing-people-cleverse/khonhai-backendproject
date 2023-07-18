import { compareHash, hashPassword } from "../auth/bcrypt";

import { Response } from "express";
import { IRepositoryBlacklist, IRepositoryUser } from "../repositories";
import { AppRequest, Empty, IHandlerUser, WithUser, WithUserId } from ".";
import { JwtAuthRequest, Payload, newJwt } from "../auth/jwt";

export function newHandlerUser(
  repo: IRepositoryUser,
  repoBlacklist: IRepositoryBlacklist
): IHandlerUser {
  return new HandlerUser(repo, repoBlacklist);
}
class HandlerUser implements IHandlerUser {
  private repo: IRepositoryUser;
  private repoBlacklist: IRepositoryBlacklist;

  constructor(repo: IRepositoryUser, repoBlacklist: IRepositoryBlacklist) {
    this.repo = repo;
    this.repoBlacklist = repoBlacklist;
  }

  async register(
    req: AppRequest<Empty, WithUser>,
    res: Response
  ): Promise<Response> {
    const {
      username,
      password,
      name,
      surname,
      email,
      phoneNumber,
      address,
      province,
      postcode,
    } = req.body;

    if (
      !username ||
      !password ||
      !name ||
      !surname ||
      !email ||
      !phoneNumber ||
      !address ||
      !province ||
      !postcode
    ) {
      return res.status(400).json({ error: "missing information" });
    }

    return this.repo
      .createUser({
        username,
        password: hashPassword(password),
        name,
        surname,
        email,
        phoneNumber,
        address,
        province,
        postcode,
      })
      .then((user) => {
        console.log(user.email);
        return res
          .status(201)
          .json({ ...user, password: undefined })
          .end();
      })
      .catch((err) =>
        res
          .status(500)
          .json({ error: `failed to register user ${username}` })
          .end()
      );
  }

  async login(
    req: AppRequest<Empty, WithUser>,
    res: Response
  ): Promise<Response> {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(500)
        .json({ error: "missing username or password" })
        .end();
    }
    return this.repo
      .getUser(username)
      .then((user) => {
        if (!compareHash(password, user.password)) {
          return res
            .status(401)
            .json({ error: "invalid password", statusCode: 401 })
            .end();
        }

        const payload: Payload = { id: user.id, username: user.username };
        const accessToken = newJwt(payload);

        return res
          .status(201)
          .json({
            status: "logged in",
            user: { ...user, password: undefined },
            id: user.id,
            accessToken,
          })
          .end();
      })
      .catch((err) => {
        console.error(`failed to get user: ${err}`);
        return res.status(500).end();
      });
  }

  async getUserDetail(
    req: JwtAuthRequest<WithUserId, Empty>,
    res: Response
  ): Promise<Response> {
    const id = req.params.id;

    return this.repo
      .getUserById(id)
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ error: `no such user: ${id}` })
            .end();
        }
        return res
          .status(200)
          .json({ user: { ...user, password: undefined } })
          .end();
      })
      .catch((err) => {
        const errMsg = `failed to get user Detail ${id}: ${err}`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg }).end();
      });
  }

  async logout(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response> {
    return this.repoBlacklist
      .addToBlacklist(req.token)
      .then(() => res.status(201).json({ status: `Logged out` }).end())
      .catch((err) => {
        console.error(err);
        return res
          .status(500)
          .json({ error: `couldn't log out with token ${req.token}` })
          .end();
      });
  }
}
