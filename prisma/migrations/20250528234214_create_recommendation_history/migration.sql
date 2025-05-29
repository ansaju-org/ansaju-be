-- CreateTable
CREATE TABLE "recommendation_history" (
    "id" SERIAL NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userUsername" TEXT,

    CONSTRAINT "recommendation_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recommendation_history" ADD CONSTRAINT "recommendation_history_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "users"("username") ON DELETE SET NULL ON UPDATE CASCADE;
