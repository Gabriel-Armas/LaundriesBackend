/*
  Warnings:

  - Changed the type of `idSucursal` on the `Empleado` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Empleado" DROP COLUMN "idSucursal",
ADD COLUMN     "idSucursal" UUID NOT NULL;
