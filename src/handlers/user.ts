import { compareHash, hashPassword } from "../auth/bcrypt";

import { Response } from "express";
import {
  IRepositoryBlacklist,
  IRepositoryBlacklistUnique,
  IRepositoryUser,
} from "../repositories";
import {
  AppRequest,
  Empty,
  IHandlerUser,
  WithEmailCheck,
  WithPhoneNumberCheck,
  WithUser,
  WithUsernameCheck,
} from ".";
import { JwtAuthRequest, Payload, newJwt } from "../auth/jwt";

export function newHandlerUser(
  repo: IRepositoryUser,
  repoBlacklist: IRepositoryBlacklist,
  repoBlacklistUnique: IRepositoryBlacklistUnique
): IHandlerUser {
  return new HandlerUser(repo, repoBlacklist, repoBlacklistUnique);
}

class HandlerUser implements IHandlerUser {
  private repo: IRepositoryUser;
  private repoBlacklist: IRepositoryBlacklist;
  private repoBlacklistUnique: IRepositoryBlacklistUnique;

  constructor(
    repo: IRepositoryUser,
    repoBlacklist: IRepositoryBlacklist,
    repoBlacklistUnique: IRepositoryBlacklistUnique
  ) {
    this.repo = repo;
    this.repoBlacklist = repoBlacklist;
    this.repoBlacklistUnique = repoBlacklistUnique;
  }

  async checkUsername(
    req: AppRequest<Empty, WithUsernameCheck>,
    res: Response
  ): Promise<Response> {
    const username = req.body.username;

    return this.repoBlacklistUnique
      .isBlacklistUsername(username)
      .then((isBlacklistedUsername) => {
        return res.status(201).json({ isBlacklistedUsername }).end();
      })
      .catch((err) =>
        res
          .status(500)
          .json({
            error: `failed to check username ${username}: ${err}`,
            statusCode: 500,
          })
          .end()
      );
  }

  async checkEmail(
    req: AppRequest<Empty, WithEmailCheck>,
    res: Response
  ): Promise<Response> {
    const email = req.body.email;

    return this.repoBlacklistUnique
      .isBlacklistEmail(email)
      .then((isBlacklistedEmail) => {
        return res.status(201).json({ isBlacklistedEmail }).end();
      })
      .catch((err) =>
        res
          .status(500)
          .json({
            error: `failed to check email ${email}: ${err}`,
            statusCode: 500,
          })
          .end()
      );
  }

  async checkPhoneNumber(
    req: AppRequest<Empty, WithPhoneNumberCheck>,
    res: Response
  ): Promise<Response> {
    const phoneNumber = req.body.phoneNumber;

    return this.repoBlacklistUnique
      .isBlacklistPhoneNumber(phoneNumber)
      .then((isBlacklistedPhoneNumber) => {
        return res.status(201).json({ isBlacklistedPhoneNumber }).end();
      })
      .catch((err) =>
        res
          .status(500)
          .json({
            error: `failed to check phoneNumber ${phoneNumber}: ${err}`,
            statusCode: 500,
          })
          .end()
      );
  }

  async register(
    req: AppRequest<Empty, WithUser>,
    res: Response
  ): Promise<Response> {
    const userRegister: WithUser = req.body;

    if (
      !userRegister.username ||
      !userRegister.password ||
      !userRegister.name ||
      !userRegister.surname ||
      !userRegister.email ||
      !userRegister.phoneNumber ||
      !userRegister.address ||
      !userRegister.province ||
      !userRegister.postcode
    ) {
      return res
        .status(400)
        .json({ error: "missing information", statusCode: 400 })
        .end();
    }

    await this.repoBlacklistUnique.addToBlacklistUsername(
      userRegister.username
    );

    await this.repoBlacklistUnique.addToBlacklistEmail(userRegister.email);

    await this.repoBlacklistUnique.addToBlacklistPhoneNumber(
      userRegister.phoneNumber
    );

    return this.repo
      .createUser({
        ...userRegister,
        password: hashPassword(userRegister.password),
      })
      .then((user) => {
        return res
          .status(201)
          .json({ ...user, password: undefined })
          .end();
      })
      .catch((err) =>
        res
          .status(500)
          .json({
            error: `failed to register user ${userRegister.username}: ${err}`,
            statusCode: 500,
          })
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
        .status(400)
        .json({ error: "missing username or password", statusCode: 400  })
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
        return res
          .status(500)
          .json({ error: `failed to get user: ${err}`, statusCode: 500 })
          .end();
      });
  }

  async getUserDetail(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response> {
    const id = req.payload.id;

    return this.repo
      .getUserById(id)
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ error: `no such user: ${id}`, statusCode: 404 })
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
        return res.status(500).json({ error: errMsg, statusCode: 500 }).end();
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
          .json({
            error: `couldn't log out with token ${req.token}`,
            statusCode: 500,
          })
          .end();
      });
  }
}
