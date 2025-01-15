/*
  Warnings:

  - You are about to drop the column `text` on the `Proverb` table. All the data in the column will be lost.
  - Added the required column `beginning` to the `Proverb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ending` to the `Proverb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proverb" DROP COLUMN "text",
ADD COLUMN     "beginning" TEXT NOT NULL,
ADD COLUMN     "ending" TEXT NOT NULL;
