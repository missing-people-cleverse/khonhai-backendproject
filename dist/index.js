"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const user_1 = require("./repositories/user");
const blacklist_1 = require("./repositories/blacklist");
const user_2 = require("./handlers/user");
const jwt_1 = require("./auth/jwt");
const content_1 = require("./repositories/content");
const content_2 = require("./handlers/content");
const comment_1 = require("./repositories/comment");
const comment_2 = require("./handlers/comment");
async function main() {
    const db = new client_1.PrismaClient();
    const redis = (0, redis_1.createClient)();
    try {
        await redis.connect();
        await db.$connect();
    }
    catch (err) {
        console.log(err);
        return;
    }
    const repoUser = (0, user_1.newRepositoryUser)(db);
    const repoBlacklist = (0, blacklist_1.newRepositoryBlacklist)(redis);
    const handlerUser = (0, user_2.newHandlerUser)(repoUser, repoBlacklist);
    const repoContent = (0, content_1.newRepositoryContent)(db);
    const handlerContent = (0, content_2.newHandlerContent)(repoContent);
    const middleware = (0, jwt_1.newMiddlewareHandler)(repoBlacklist);
    const repoComment = (0, comment_1.newRepositoryComment)(db);
    const handlerComment = (0, comment_2.newHandlerComment)(repoComment);
    const port = process.env.PORT || 8000;
    const server = (0, express_1.default)();
    const userRouter = express_1.default.Router();
    const contentRouter = express_1.default.Router();
    const commentRouter = express_1.default.Router();
    var cors = require("cors");
    server.use(cors());
    server.use(express_1.default.json());
    server.use("/user", userRouter);
    server.use("/content", contentRouter);
    server.use("/comment", commentRouter);
    server.get("/", (_, res) => res.status(200).json({ status: "ok" }).end());
    //User API
    userRouter.post("/register", handlerUser.register.bind(handlerUser));
    userRouter.post("/login", handlerUser.login.bind(handlerUser));
    userRouter.get("/me", middleware.jwtMiddleware.bind(middleware), handlerUser.login.bind(handlerUser));
    userRouter.get("/:id", middleware.jwtMiddleware.bind(middleware), handlerUser.getUserDetail.bind(handlerUser));
    userRouter.post("/logout", middleware.jwtMiddleware.bind(middleware), handlerUser.logout.bind(handlerUser));
    //Content API
    contentRouter.post("/create", middleware.jwtMiddleware.bind(middleware), handlerContent.createContent.bind(handlerContent));
    contentRouter.get("/", handlerContent.getContents.bind(handlerContent));
    contentRouter.get("/:id", handlerContent.getContent.bind(handlerContent));
    contentRouter.patch("/edit/:id", middleware.jwtMiddleware.bind(middleware), handlerContent.updateContent.bind(handlerContent));
    contentRouter.delete("/delete/:id", middleware.jwtMiddleware.bind(middleware), handlerContent.deleteContent.bind(handlerContent));
    //Comment API
    commentRouter.post("/:id", middleware.jwtMiddleware.bind(middleware), handlerComment.createComment.bind(handlerComment));
    // unused
    commentRouter.get("/", handlerComment.getComments.bind(handlerComment));
    commentRouter.patch("/edit/:id", middleware.jwtMiddleware.bind(middleware), handlerComment.updateComment.bind(handlerComment));
    commentRouter.delete("/delete/:id", middleware.jwtMiddleware.bind(middleware), handlerComment.deleteComment.bind(handlerComment));
    server.listen(port, () => console.log(`server listening on ${port}`));
}
main();
//# sourceMappingURL=index.js.map