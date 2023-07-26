import { PrismaClient } from "@prisma/client";
import express from "express";
import { createClient } from "redis";

import { newRepositoryUser } from "./repositories/user";
import { newRepositoryBlacklist } from "./repositories/blacklist";
import { newHandlerUser } from "./handlers/user";

import { newMiddlewareHandler } from "./auth/jwt";

import { newRepositoryContent } from "./repositories/content";
import { newHandlerContent } from "./handlers/content";
import { newRepositoryComment } from "./repositories/comment";
import { newHandlerComment } from "./handlers/comment";
import { newRepositoryBlacklistUnique } from "./repositories/unique";

// S3
import multer from "multer";

async function main() {
  const db = new PrismaClient();
  const redis = createClient<any, any, any>();

  try {
    await redis.connect();
    await db.$connect();
  } catch (err) {
    console.log(err);
    return;
  }

  const repoUser = newRepositoryUser(db);
  const repoBlacklist = newRepositoryBlacklist(redis);
  const repoBlacklistUnique = newRepositoryBlacklistUnique(redis);
  const handlerUser = newHandlerUser(
    repoUser,
    repoBlacklist,
    repoBlacklistUnique
  );

  const repoContent = newRepositoryContent(db);
  const handlerContent = newHandlerContent(repoContent);

  const middleware = newMiddlewareHandler(repoBlacklist);

  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  const repoComment = newRepositoryComment(db);
  const handlerComment = newHandlerComment(repoComment);

  const port = process.env.PORT || 8000;

  const server = express();
  const userRouter = express.Router();
  const contentRouter = express.Router();
  const commentRouter = express.Router();

  var cors = require("cors");
  server.use(cors());

  server.use(express.json());
  server.use("/user", userRouter);
  server.use("/content", contentRouter);
  server.use("/comment", commentRouter);

  server.get("/", (_, res) => res.status(200).json({ status: "ok" }).end());

  //Check Unique User Info
  userRouter.post(
    "/register/checkusername",
    handlerUser.checkUsername.bind(handlerUser)
  );
  userRouter.post(
    "/register/checkemail",
    handlerUser.checkEmail.bind(handlerUser)
  );
  userRouter.post(
    "/register/checkphonenumber",
    handlerUser.checkPhoneNumber.bind(handlerUser)
  );

  //User API
  userRouter.post("/register", handlerUser.register.bind(handlerUser));
  userRouter.post("/login", handlerUser.login.bind(handlerUser));
  userRouter.get(
    "/",
    middleware.jwtMiddleware.bind(middleware),
    handlerUser.getUserDetail.bind(handlerUser)
  );
  userRouter.post(
    "/logout",
    middleware.jwtMiddleware.bind(middleware),
    handlerUser.logout.bind(handlerUser)
  );

  //Content API
  contentRouter.post(
    "/create",
    middleware.jwtMiddleware.bind(middleware),
    upload.fields([{ name: "photos", maxCount: 4 }]),
    handlerContent.createContent.bind(handlerContent)
  );
  contentRouter.get("/", handlerContent.getContents.bind(handlerContent));
  contentRouter.get("/:id", handlerContent.getContent.bind(handlerContent));
  contentRouter.patch(
    "/edit/:id",
    middleware.jwtMiddleware.bind(middleware),
    handlerContent.updateContent.bind(handlerContent)
  );
  contentRouter.patch(
    "/delete/:id",
    middleware.jwtMiddleware.bind(middleware),
    handlerContent.deleteContent.bind(handlerContent)
  );

  //Comment API
  commentRouter.post(
    "/:id",
    middleware.jwtMiddleware.bind(middleware),
    upload.fields([{ name: "photos", maxCount: 4 }]),
    handlerComment.createComment.bind(handlerComment)
  );

  commentRouter.patch(
    "/edit/:id",
    middleware.jwtMiddleware.bind(middleware),
    handlerComment.updateComment.bind(handlerComment)
  );
  commentRouter.patch(
    "/delete/:id",
    middleware.jwtMiddleware.bind(middleware),
    handlerComment.deleteComment.bind(handlerComment)
  );

  //getCommentbyContentId
  commentRouter.get("/:id", handlerComment.getComment.bind(handlerComment));

  server.listen(port, () => console.log(`server listening on ${port}`));
}

main();
