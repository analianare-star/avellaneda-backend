/*
  Warnings:

  - The `status` column on the `Stream` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('Instagram', 'TikTok', 'Facebook', 'YouTube');

-- CreateEnum
CREATE TYPE "StreamStatus" AS ENUM ('UPCOMING', 'LIVE', 'FINISHED', 'MISSED');

-- AlterTable
ALTER TABLE "Reel" ADD COLUMN     "platform" "SocialPlatform" NOT NULL DEFAULT 'Instagram';

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "extensionCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "platform" "SocialPlatform" NOT NULL DEFAULT 'Instagram',
ADD COLUMN     "reportCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "scheduledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "url" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "StreamStatus" NOT NULL DEFAULT 'UPCOMING';

-- CreateTable
CREATE TABLE "ShopSocialHandle" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "handle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopSocialHandle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopWhatsappLine" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopWhatsappLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopSocialHandle_shopId_platform_key" ON "ShopSocialHandle"("shopId", "platform");

-- AddForeignKey
ALTER TABLE "ShopSocialHandle" ADD CONSTRAINT "ShopSocialHandle_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopWhatsappLine" ADD CONSTRAINT "ShopWhatsappLine_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
