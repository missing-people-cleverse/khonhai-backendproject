/*
  Warnings:

  - You are about to drop the `Img` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Img" DROP CONSTRAINT "Img_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Img" DROP CONSTRAINT "Img_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Img" DROP CONSTRAINT "Img_userId_fkey";

-- DropTable
DROP TABLE "Img";
