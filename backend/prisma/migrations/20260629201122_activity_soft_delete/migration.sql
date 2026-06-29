-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "activity_categories" ADD COLUMN     "deletedAt" TIMESTAMP(3);
