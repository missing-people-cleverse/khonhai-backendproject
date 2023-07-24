/*
  Warnings:

  - Added the required column `imgUrl` to the `Img` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Img" ADD COLUMN     "imgUrl" TEXT NOT NULL;
