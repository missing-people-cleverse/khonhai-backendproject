-- CreateTable
CREATE TABLE "Img" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "Img_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Img" ADD CONSTRAINT "Img_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Img" ADD CONSTRAINT "Img_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Img" ADD CONSTRAINT "Img_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
