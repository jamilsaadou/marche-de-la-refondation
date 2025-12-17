-- CreateTable
CREATE TABLE `Evaluation` (
    `id` VARCHAR(191) NOT NULL,
    `demandeId` VARCHAR(191) NOT NULL,
    `evaluateurId` VARCHAR(191) NOT NULL,
    `scores` TEXT NOT NULL,
    `commentaires` TEXT NULL,
    `scoreTotal` DOUBLE NOT NULL,
    `decision` VARCHAR(191) NULL,
    `dateEvaluation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Evaluation_demandeId_idx`(`demandeId`),
    INDEX `Evaluation_evaluateurId_idx`(`evaluateurId`),
    INDEX `Evaluation_dateEvaluation_idx`(`dateEvaluation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_demandeId_fkey` FOREIGN KEY (`demandeId`) REFERENCES `DemandeExposant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_evaluateurId_fkey` FOREIGN KEY (`evaluateurId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
