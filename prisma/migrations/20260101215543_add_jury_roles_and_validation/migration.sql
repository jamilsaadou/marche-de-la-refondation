/*
  Warnings:

  - A unique constraint covering the columns `[demandeId,evaluateurId]` on the table `Evaluation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Evaluation` ADD COLUMN `estValidationFinale` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `Admin_role_idx` ON `Admin`(`role`);

-- CreateIndex
CREATE UNIQUE INDEX `Evaluation_demandeId_evaluateurId_key` ON `Evaluation`(`demandeId`, `evaluateurId`);
