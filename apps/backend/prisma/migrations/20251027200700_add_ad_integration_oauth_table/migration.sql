-- CreateTable
CREATE TABLE "ad_integrations" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "clientId" VARCHAR(255) NOT NULL,
    "clientSecret" VARCHAR(255) NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "status" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_integrations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ad_integrations" ADD CONSTRAINT "ad_integrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
