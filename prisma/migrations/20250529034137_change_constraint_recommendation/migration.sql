/*
  Warnings:

  - Made the column `userUsername` on table `recommendation_history` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "recommendation_history" DROP CONSTRAINT "recommendation_history_userUsername_fkey";

-- AlterTable
ALTER TABLE "recommendation_history" ALTER COLUMN "userUsername" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "recommendation_history" ADD CONSTRAINT "recommendation_history_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
