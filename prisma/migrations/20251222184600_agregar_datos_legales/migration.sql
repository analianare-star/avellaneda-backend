/*
  Warnings:

  - You are about to drop the column `description` on the `Shop` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Shop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Shop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Shop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "description",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "addressDetails" JSONB,
ADD COLUMN     "cuit" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "minimumPurchase" INTEGER DEFAULT 0,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "paymentMethods" TEXT[],
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'BASIC',
ADD COLUMN     "razonSocial" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Shop_slug_key" ON "Shop"("slug");
