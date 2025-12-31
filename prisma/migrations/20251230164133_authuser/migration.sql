/*
  Warnings:

  - A unique constraint covering the columns `[authUserId]` on the table `Shop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AuthUserType" AS ENUM ('CLIENT', 'SHOP', 'ADMIN');

-- CreateEnum
CREATE TYPE "AuthUserStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPERADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "authUserId" TEXT,
ADD COLUMN     "requiresEmailFix" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AuthUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "userType" "AuthUserType" NOT NULL,
    "status" "AuthUserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "AuthUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "authUserId" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'MODERATOR',
    "adminStatus" "AdminStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("authUserId")
);

-- CreateTable
CREATE TABLE "Client" (
    "authUserId" TEXT NOT NULL,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("authUserId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_email_key" ON "AuthUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_authUserId_key" ON "Shop"("authUserId");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_authUserId_fkey" FOREIGN KEY ("authUserId") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_authUserId_fkey" FOREIGN KEY ("authUserId") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_authUserId_fkey" FOREIGN KEY ("authUserId") REFERENCES "AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
