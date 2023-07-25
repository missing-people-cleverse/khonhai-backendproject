/*
  Warnings:

  - The `img` column on the `Comment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `img` column on the `Content` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "img",
ADD COLUMN     "img" TEXT[];

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "img",
ADD COLUMN     "img" TEXT[];
