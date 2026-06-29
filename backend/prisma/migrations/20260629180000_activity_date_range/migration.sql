-- Activities now support a duration that can span multiple days/periods.
-- `date` becomes `startDate`; a new `endDate` is added and backfilled so
-- existing single-day tasks keep startDate == endDate.

DROP INDEX "activities_userId_date_idx";

ALTER TABLE "activities" RENAME COLUMN "date" TO "startDate";

ALTER TABLE "activities" ADD COLUMN "endDate" DATE;
UPDATE "activities" SET "endDate" = "startDate";
ALTER TABLE "activities" ALTER COLUMN "endDate" SET NOT NULL;

CREATE INDEX "activities_userId_startDate_idx" ON "activities"("userId", "startDate");
