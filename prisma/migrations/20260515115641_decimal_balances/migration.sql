/*
  Warnings:

  - You are about to alter the column `amount` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `balance` on the `PayingAccount` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "amount" SET DEFAULT 0.0,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "PayingAccount" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'RON',
ALTER COLUMN "balance" SET DATA TYPE DECIMAL(65,30);
