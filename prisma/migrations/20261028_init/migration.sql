-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ConstitutionStatus" AS ENUM ('DRAFT', 'ACTIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Constitution" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'My Personal Constitution',
    "subtitle" TEXT,
    "preamble" TEXT,
    "missionStatement" TEXT,
    "status" "ConstitutionStatus" NOT NULL DEFAULT 'DRAFT',
    "establishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Constitution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Value" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConstitutionValue" (
    "id" TEXT NOT NULL,
    "constitutionId" TEXT NOT NULL,
    "valueId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "personalNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConstitutionValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Principle" (
    "id" TEXT NOT NULL,
    "constitutionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Principle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boundary" (
    "id" TEXT NOT NULL,
    "constitutionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domain" TEXT NOT NULL DEFAULT 'General',
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boundary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionEntry" (
    "id" TEXT NOT NULL,
    "constitutionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "domain" TEXT NOT NULL DEFAULT 'General',
    "reflection" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DecisionEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionValue" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "valueId" TEXT NOT NULL,

    CONSTRAINT "DecisionValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConstitutionVersion" (
    "id" TEXT NOT NULL,
    "constitutionId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConstitutionVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyReflection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "constitutionId" TEXT,
    "wentWell" TEXT NOT NULL,
    "principlesFollowed" TEXT NOT NULL,
    "improvementNotes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyReflection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Constitution_userId_idx" ON "Constitution"("userId");

-- CreateIndex
CREATE INDEX "Constitution_createdAt_idx" ON "Constitution"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Value_slug_key" ON "Value"("slug");

-- CreateIndex
CREATE INDEX "Value_userId_idx" ON "Value"("userId");

-- CreateIndex
CREATE INDEX "Value_isSystem_idx" ON "Value"("isSystem");

-- CreateIndex
CREATE INDEX "ConstitutionValue_constitutionId_idx" ON "ConstitutionValue"("constitutionId");

-- CreateIndex
CREATE INDEX "ConstitutionValue_valueId_idx" ON "ConstitutionValue"("valueId");

-- CreateIndex
CREATE UNIQUE INDEX "ConstitutionValue_constitutionId_valueId_key" ON "ConstitutionValue"("constitutionId", "valueId");

-- CreateIndex
CREATE INDEX "Principle_constitutionId_idx" ON "Principle"("constitutionId");

-- CreateIndex
CREATE INDEX "Principle_category_idx" ON "Principle"("category");

-- CreateIndex
CREATE INDEX "Principle_position_idx" ON "Principle"("position");

-- CreateIndex
CREATE INDEX "Boundary_constitutionId_idx" ON "Boundary"("constitutionId");

-- CreateIndex
CREATE INDEX "Boundary_domain_idx" ON "Boundary"("domain");

-- CreateIndex
CREATE INDEX "Boundary_position_idx" ON "Boundary"("position");

-- CreateIndex
CREATE INDEX "DecisionEntry_userId_idx" ON "DecisionEntry"("userId");

-- CreateIndex
CREATE INDEX "DecisionEntry_constitutionId_idx" ON "DecisionEntry"("constitutionId");

-- CreateIndex
CREATE INDEX "DecisionEntry_createdAt_idx" ON "DecisionEntry"("createdAt");

-- CreateIndex
CREATE INDEX "DecisionValue_decisionId_idx" ON "DecisionValue"("decisionId");

-- CreateIndex
CREATE INDEX "DecisionValue_valueId_idx" ON "DecisionValue"("valueId");

-- CreateIndex
CREATE UNIQUE INDEX "DecisionValue_decisionId_valueId_key" ON "DecisionValue"("decisionId", "valueId");

-- CreateIndex
CREATE INDEX "ConstitutionVersion_constitutionId_idx" ON "ConstitutionVersion"("constitutionId");

-- CreateIndex
CREATE INDEX "ConstitutionVersion_createdAt_idx" ON "ConstitutionVersion"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ConstitutionVersion_constitutionId_versionNumber_key" ON "ConstitutionVersion"("constitutionId", "versionNumber");

-- CreateIndex
CREATE INDEX "WeeklyReflection_userId_idx" ON "WeeklyReflection"("userId");

-- CreateIndex
CREATE INDEX "WeeklyReflection_constitutionId_idx" ON "WeeklyReflection"("constitutionId");

-- CreateIndex
CREATE INDEX "WeeklyReflection_createdAt_idx" ON "WeeklyReflection"("createdAt");

-- AddForeignKey
ALTER TABLE "Constitution" ADD CONSTRAINT "Constitution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Value" ADD CONSTRAINT "Value_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstitutionValue" ADD CONSTRAINT "ConstitutionValue_constitutionId_fkey" FOREIGN KEY ("constitutionId") REFERENCES "Constitution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstitutionValue" ADD CONSTRAINT "ConstitutionValue_valueId_fkey" FOREIGN KEY ("valueId") REFERENCES "Value"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Principle" ADD CONSTRAINT "Principle_constitutionId_fkey" FOREIGN KEY ("constitutionId") REFERENCES "Constitution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boundary" ADD CONSTRAINT "Boundary_constitutionId_fkey" FOREIGN KEY ("constitutionId") REFERENCES "Constitution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionEntry" ADD CONSTRAINT "DecisionEntry_constitutionId_fkey" FOREIGN KEY ("constitutionId") REFERENCES "Constitution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionEntry" ADD CONSTRAINT "DecisionEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionValue" ADD CONSTRAINT "DecisionValue_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "DecisionEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionValue" ADD CONSTRAINT "DecisionValue_valueId_fkey" FOREIGN KEY ("valueId") REFERENCES "Value"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstitutionVersion" ADD CONSTRAINT "ConstitutionVersion_constitutionId_fkey" FOREIGN KEY ("constitutionId") REFERENCES "Constitution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReflection" ADD CONSTRAINT "WeeklyReflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReflection" ADD CONSTRAINT "WeeklyReflection_constitutionId_fkey" FOREIGN KEY ("constitutionId") REFERENCES "Constitution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

