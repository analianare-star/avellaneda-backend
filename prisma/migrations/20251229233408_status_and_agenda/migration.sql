-- CreateEnum
CREATE TYPE "ShopStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'AGENDA_SUSPENDED', 'HIDDEN', 'BANNED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'VALIDATED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "StreamStatus" ADD VALUE 'CANCELLED';
ALTER TYPE "StreamStatus" ADD VALUE 'BANNED';
ALTER TYPE "StreamStatus" ADD VALUE 'PENDING_REPROGRAMMATION';

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "agendaSuspendedByAdminId" TEXT,
ADD COLUMN     "agendaSuspendedReason" TEXT,
ADD COLUMN     "agendaSuspendedUntil" TIMESTAMP(3),
ADD COLUMN     "status" "ShopStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
ADD COLUMN     "statusChangedAt" TIMESTAMP(3),
ADD COLUMN     "statusReason" TEXT;

-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "durationMinutes" INTEGER,
ADD COLUMN     "editCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastEditedAt" TIMESTAMP(3),
ADD COLUMN     "originalScheduledAt" TIMESTAMP(3),
ADD COLUMN     "pendingReprogramNote" TEXT,
ADD COLUMN     "reprogramBatchId" TEXT,
ADD COLUMN     "reprogramReason" TEXT,
ADD COLUMN     "reprogrammedFromId" TEXT,
ADD COLUMN     "scheduledEndPlanned" TIMESTAMP(3),
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'America/Argentina/Buenos_Aires',
ADD COLUMN     "visibilityReason" TEXT;
