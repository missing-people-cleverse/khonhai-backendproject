"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newMiddlewareHandler = exports.newJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || "content-secrets";
function newJwt(data) {
    return jsonwebtoken_1.default.sign(data, secret, {
        expiresIn: "12h",
        issuer: "content-api",
        subject: "user-login",
        audience: "user",
    });
}
exports.newJwt = newJwt;
function newMiddlewareHandler(repoBlacklist) {
    return new MiddlewareHandler(repoBlacklist);
}
exports.newMiddlewareHandler = newMiddlewareHandler;
class MiddlewareHandler {
    constructor(repo) {
        this.repoBlacklist = repo;
    }
    async jwtMiddleware(req, res, next) {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        try {
            if (!token) {
                return res.status(401).json({ error: "missing JWT token" }).end();
            }
            const isBlacklisted = await this.repoBlacklist.isBlacklist(token);
            if (isBlacklisted) {
                return res.status(401).json({ status: "already logged out" }).end();
            }
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            const id = decoded["id"];
            const username = decoded["username"];
            if (!id) {
                return res.status(401).json({ error: "missing payload id" }).end();
            }
            if (!username) {
                return res
                    .status(401)
                    .json({ error: "missing payload username" })
                    .end();
            }
            req.token = token;
            req.payload = { id, username };
            return next();
        }
        catch (err) {
            console.error(`Auth failed for token ${token}: ${err}`);
            return res.status(400).json({ error: "authentication failed" }).end();
        }
    }
}
//# sourceMappingURL=jwt.js.map