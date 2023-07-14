/*
  Warnings:

  - Changed the type of `nationality` on the `Content` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `gender` on the `Content` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `skin` on the `Content` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Content` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `province` on the `Content` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `province` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Nationality" AS ENUM ('THAI', 'NONTHAI');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Skin" AS ENUM ('WHITE', 'WHITEYELLOW', 'WHITERED', 'BLACK', 'BLACKYELLOW', 'BLACKRED', 'NORNAL');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('UNFOUNED', 'FOUNDED');

-- CreateEnum
CREATE TYPE "Province" AS ENUM ('BANGKOK', 'KRABI', 'KANCHANABURI', 'KALASIN', 'KAMPHAENGPHET', 'KHONKAEN', 'CHANTHABURI', 'CHACHOENGSAO', 'CHONBURI', 'CHAINAT', 'CHAIYAPHUM', 'CHUMPHON', 'CHIANGRAI', 'CHIANGMAI', 'TRANG', 'TRAT', 'TAK', 'NAKHONNAYOK', 'NAKHONPATHOM', 'NAKHONPHANOM', 'NAKHONRATCHASIMA', 'NAKHONSITHAMMARAT', 'NAKHONSAWAN', 'NONTHABURI', 'NARATHIWAT', 'NAN', 'BUENGKAN', 'BURIRAM', 'PATHUMTHANI', 'PRACHUAPKHIRIKHAN', 'PRACHINBURI', 'PATTANI', 'PHRANAKHONSIAYUTTHAYA', 'PHAYAO', 'PHANGNGA', 'PHATTHALUNG', 'PHICHIT', 'PHITSANULOK', 'PHETCHABURI', 'PHETCHABUN', 'PHRAE', 'PHUKET', 'MAHASARAKHAM', 'MUKDAHAN', 'MAEHONGSON', 'YASOTHON', 'YALA', 'ROIET', 'RANONG', 'RAYONG', 'RATCHABURI', 'LOPBURI', 'LAMPANG', 'LAMPHUN', 'LOEI', 'SISAKET', 'SAKONNAKHON', 'SONGKHLA', 'SATUN', 'SAMUTPRAKAN', 'SAMUTSONGKHRAM', 'SAMUTSAKHON', 'SAKAEO', 'SARABURI', 'SINGBURI', 'SUKHOTHAI', 'SUPHANBURI', 'SURATTHANI', 'SURIN', 'NONGKHAI', 'NONGBUALAMPHU', 'ANGTHONG', 'AMNATCHAROEN', 'UDONTHANI', 'UTTARADIT', 'UTHAITHANI', 'UBONRATCHATHANI');

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "nationality",
ADD COLUMN     "nationality" "Nationality" NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL,
DROP COLUMN "skin",
ADD COLUMN     "skin" "Skin" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL,
DROP COLUMN "province",
ADD COLUMN     "province" "Province" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "province",
ADD COLUMN     "province" "Province" NOT NULL;
