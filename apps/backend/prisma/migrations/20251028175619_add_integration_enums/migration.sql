/*
  Warnings:

  - Changed the type of `provider` on the `ad_integrations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `ad_integrations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AdProvider" AS ENUM ('google_ads', 'facebook_ads');

-- CreateEnum
CREATE TYPE "AdIntegrationStatus" AS ENUM ('active', 'inactive', 'error');

-- AlterTable
ALTER TABLE "ad_integrations" DROP COLUMN "provider",
ADD COLUMN     "provider" "AdProvider" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "AdIntegrationStatus" NOT NULL;
