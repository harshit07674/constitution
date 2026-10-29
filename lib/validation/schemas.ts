import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please provide a valid email address").max(255).toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be under 100 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const constitutionSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(150, "Title must be under 150 characters"),
  subtitle: z.string().trim().max(255).nullable().optional(),
  preamble: z.string().trim().max(5000, "Preamble cannot exceed 5000 characters").nullable().optional(),
  missionStatement: z.string().trim().max(3000, "Mission statement cannot exceed 3000 characters").nullable().optional(),
  status: z.enum(["DRAFT", "ACTIVE"]).optional(),
  establishedAt: z.string().nullable().optional(),
});

export const createCustomValueSchema = z.object({
  name: z.string().trim().min(2, "Value name must be at least 2 characters").max(50, "Value name cannot exceed 50 characters"),
  description: z.string().trim().max(500, "Description cannot exceed 500 characters").nullable().optional(),
});

export const addConstitutionValueSchema = z.object({
  valueId: z.string().uuid("Invalid value identifier"),
  personalNote: z.string().trim().max(500, "Personal note cannot exceed 500 characters").nullable().optional(),
  position: z.number().int().min(0).optional(),
});

export const principleSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(120, "Title cannot exceed 120 characters"),
  statement: z.string().trim().min(5, "Statement must be at least 5 characters").max(3000, "Statement cannot exceed 3000 characters"),
  category: z.string().trim().min(1, "Category is required").max(50),
  position: z.number().int().min(0).optional(),
});

export const reorderPrinciplesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().int().min(0),
    })
  ).min(1, "At least one item required"),
});

export const boundarySchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(120, "Title cannot exceed 120 characters"),
  description: z.string().trim().min(5, "Description must be at least 5 characters").max(3000, "Description cannot exceed 3000 characters"),
  domain: z.string().trim().min(1, "Domain is required").max(50),
  position: z.number().int().min(0).optional(),
});

export const decisionSchema = z.object({
  constitutionId: z.string().uuid("Invalid constitution identifier"),
  title: z.string().trim().min(2, "Decision title must be at least 2 characters").max(150, "Title cannot exceed 150 characters"),
  context: z.string().trim().min(5, "Context must be at least 5 characters").max(5000, "Context cannot exceed 5000 characters"),
  domain: z.string().trim().min(1, "Domain is required").max(50),
  reflection: z.string().trim().max(5000, "Reflection cannot exceed 5000 characters").nullable().optional(),
  valueIds: z.array(z.string().uuid()).optional(),
});

export const reflectionSchema = z.object({
  constitutionId: z.string().uuid().nullable().optional(),
  wentWell: z.string().trim().min(5, "Reflection notes must be at least 5 characters").max(5000),
  principlesFollowed: z.string().trim().min(5, "Principles followed must be at least 5 characters").max(5000),
  improvementNotes: z.string().trim().min(5, "Improvement notes must be at least 5 characters").max(5000),
});

export const createVersionSchema = z.object({
  note: z.string().trim().max(500).nullable().optional(),
});

