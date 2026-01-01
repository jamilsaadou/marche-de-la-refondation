-- AlterTable
ALTER TABLE `DemandeExposant` ADD COLUMN `adaptationDemandeCroissante` VARCHAR(191) NULL,
    ADD COLUMN `certificatConformite` VARCHAR(191) NULL,
    ADD COLUMN `innovation` TEXT NULL,
    ADD COLUMN `nombreFemmes` INTEGER NULL,
    ADD COLUMN `nombreJeunes` INTEGER NULL,
    ADD COLUMN `origineMatieresPremieres` VARCHAR(191) NULL,
    ADD COLUMN `regulariteApprovisionnement` VARCHAR(191) NULL,
    ADD COLUMN `transformationAuNiger` VARCHAR(191) NULL;
