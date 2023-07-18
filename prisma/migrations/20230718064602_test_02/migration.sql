/*
  Warnings:

  - The values [NORNAL] on the enum `Skin` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Skin_new" AS ENUM ('WHITE', 'WHITEYELLOW', 'WHITERED', 'BLACK', 'BLACKYELLOW', 'BLACKRED', 'NORMAL');
ALTER TABLE "Content" ALTER COLUMN "skin" TYPE "Skin_new" USING ("skin"::text::"Skin_new");
ALTER TYPE "Skin" RENAME TO "Skin_old";
ALTER TYPE "Skin_new" RENAME TO "Skin";
DROP TYPE "Skin_old";
COMMIT;
