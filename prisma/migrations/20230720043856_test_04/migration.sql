-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "foundDatetime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "dateOfBirth" SET DATA TYPE TEXT,
ALTER COLUMN "missingDatetime" SET DATA TYPE TEXT;
