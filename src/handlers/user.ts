import { compareHash, hashPassword } from "../auth/bcrypt";

import { Request, Response } from "express";
import { IRepositoryUser } from "../repositories";

export interface AppRequest<Params, Body> extends Request<Params, any, Body> {}

export interface Empty {}

export interface WithUser {
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: string;
  province: string;
  postcode: string;
}

class HandlerUser {
  private repo: IRepositoryUser;

  constructor(repo: IRepositoryUser) {
    this.repo = repo;
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
      .then((user) =>
        res
          .status(201)
          .json({ ...user, password: undefined })
          .end()
      )
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
        if (compareHash(password, user.password)) {
          return res
            .status(401)
            .json({ error: "invalid password", statusCode: 401 })
            .end();
        }
        return res
          .status(201)
          .json({ status: "logged in", user: { ...user, password: undefined } })
          .end();
      })
      .catch((err) => {
        console.error(`failed to get user: ${err}`);
        return res.status(500).end();
      });
  }
}
