-- Rename activity_categories -> projects (preserving rows) and align names.
ALTER TABLE "activity_categories" RENAME TO "projects";
ALTER TABLE "projects" RENAME CONSTRAINT "activity_categories_pkey" TO "projects_pkey";
ALTER TABLE "projects" RENAME CONSTRAINT "activity_categories_userId_fkey" TO "projects_userId_fkey";
ALTER INDEX "activity_categories_userId_idx" RENAME TO "projects_userId_idx";

-- Join table for the new many-to-many between activities and projects.
CREATE TABLE "activity_projects" (
    "activityId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "activity_projects_pkey" PRIMARY KEY ("activityId", "projectId")
);
CREATE INDEX "activity_projects_projectId_idx" ON "activity_projects"("projectId");

-- Preserve existing single-project assignments.
INSERT INTO "activity_projects" ("activityId", "projectId")
SELECT "id", "categoryId" FROM "activities" WHERE "categoryId" IS NOT NULL;

-- Drop the old single FK column.
ALTER TABLE "activities" DROP CONSTRAINT "activities_categoryId_fkey";
ALTER TABLE "activities" DROP COLUMN "categoryId";

-- Wire up join table foreign keys.
ALTER TABLE "activity_projects" ADD CONSTRAINT "activity_projects_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "activity_projects" ADD CONSTRAINT "activity_projects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
