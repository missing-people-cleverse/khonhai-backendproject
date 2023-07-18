/*
  Warnings:

  - You are about to drop the column `usedId` on the `Content` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_usedId_fkey";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "usedId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
