"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerUser = void 0;
const bcrypt_1 = require("../auth/bcrypt");
const jwt_1 = require("../auth/jwt");
function newHandlerUser(repo, repoBlacklist) {
    return new HandlerUser(repo, repoBlacklist);
}
exports.newHandlerUser = newHandlerUser;
class HandlerUser {
    constructor(repo, repoBlacklist) {
        this.repo = repo;
        this.repoBlacklist = repoBlacklist;
    }
    async register(req, res) {
        const userRegister = req.body;
        if (!userRegister.username ||
            !userRegister.password ||
            !userRegister.name ||
            !userRegister.surname ||
            !userRegister.email ||
            !userRegister.phoneNumber ||
            !userRegister.address ||
            !userRegister.province ||
            !userRegister.postcode) {
            return res.status(400).json({ error: "missing information" }).end();
        }
        return this.repo
            .createUser({
            ...userRegister,
            password: (0, bcrypt_1.hashPassword)(userRegister.password),
        })
            .then((user) => {
            console.log(user.email);
            return res
                .status(201)
                .json({ ...user, password: undefined })
                .end();
        })
            .catch((err) => res
            .status(500)
            .json({ error: `failed to register user ${userRegister.username}` })
            .end());
    }
    async login(req, res) {
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
            if (!(0, bcrypt_1.compareHash)(password, user.password)) {
                return res
                    .status(401)
                    .json({ error: "invalid password", statusCode: 401 })
                    .end();
            }
            const payload = { id: user.id, username: user.username };
            const accessToken = (0, jwt_1.newJwt)(payload);
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
                .json({ error: `failed to get user: ${err}` })
                .end();
        });
    }
    async getUserDetail(req, res) {
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
    async logout(req, res) {
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
//# sourceMappingURL=user.js.map