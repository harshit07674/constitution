import test from "node:test";
import assert from "node:assert/strict";
import {
  constitutionSchema,
  createCustomValueSchema,
  addConstitutionValueSchema,
  principleSchema,
  reorderPrinciplesSchema,
  boundarySchema,
  decisionSchema,
  reflectionSchema,
} from "../lib/validation/schemas.ts";

test("Constitution creation and update validation", () => {
  const valid = constitutionSchema.safeParse({
    title: "The Sovereign Charter",
    subtitle: "A life well lived",
    preamble: "We, the undersigned, hereby establish these principles...",
    missionStatement: "To pursue excellence and wisdom.",
    status: "ACTIVE",
  });
  assert.strictEqual(valid.success, true);

  // Blank/short title rejected
  const emptyTitle = constitutionSchema.safeParse({
    title: " ",
  });
  assert.strictEqual(emptyTitle.success, false);
});

test("Values validation", () => {
  const validCustom = createCustomValueSchema.safeParse({
    name: "Craftsmanship",
    description: "Deep attention to quality and durability.",
  });
  assert.strictEqual(validCustom.success, true);

  const emptyName = createCustomValueSchema.safeParse({
    name: "   ",
  });
  assert.strictEqual(emptyName.success, false);

  const validAdd = addConstitutionValueSchema.safeParse({
    valueId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    personalNote: "Important for creative endeavors",
    position: 0,
  });
  assert.strictEqual(validAdd.success, true);

  const invalidUuid = addConstitutionValueSchema.safeParse({
    valueId: "not-a-uuid",
  });
  assert.strictEqual(invalidUuid.success, false);
});

test("Principles validation", () => {
  const valid = principleSchema.safeParse({
    title: "Speak Truth",
    statement: "Never say as true what you have not verified.",
    category: "Integrity",
    position: 1,
  });
  assert.strictEqual(valid.success, true);

  const shortStatement = principleSchema.safeParse({
    title: "Speak Truth",
    statement: "No",
    category: "Integrity",
  });
  assert.strictEqual(shortStatement.success, false);

  const validReorder = reorderPrinciplesSchema.safeParse({
    items: [
      { id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", position: 0 },
      { id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22", position: 1 },
    ],
  });
  assert.strictEqual(validReorder.success, true);
});

test("Boundaries validation", () => {
  const valid = boundarySchema.safeParse({
    title: "No Screen Meals",
    description: "Phones are absent during all family dinners.",
    domain: "Relationships",
    position: 0,
  });
  assert.strictEqual(valid.success, true);

  const missingDomain = boundarySchema.safeParse({
    title: "No Screen Meals",
    description: "Phones are absent during all family dinners.",
    domain: "",
  });
  assert.strictEqual(missingDomain.success, false);
});

test("Decision entry validation", () => {
  const valid = decisionSchema.safeParse({
    constitutionId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    title: "Accepting Offer A vs Building Project B",
    domain: "Work",
    context: "Offer A brings predictable income; Project B brings creative autonomy.",
    reflection: "Project B aligns directly with the autonomy principle.",
    valueIds: ["b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22"],
  });
  assert.strictEqual(valid.success, true);

  const invalidConstId = decisionSchema.safeParse({
    constitutionId: "invalid-id",
    title: "Decision",
    domain: "Work",
    context: "Context here",
  });
  assert.strictEqual(invalidConstId.success, false);
});

test("Weekly reflection validation", () => {
  const valid = reflectionSchema.safeParse({
    wentWell: "Completed morning routines every single weekday.",
    principlesFollowed: "Upheld honesty in the team critique.",
    improvementNotes: "Avoid scrolling after 9:00 PM next week.",
  });
  assert.strictEqual(valid.success, true);

  const missingFields = reflectionSchema.safeParse({
    wentWell: "",
    principlesFollowed: "Upheld honesty.",
    improvementNotes: "Work harder.",
  });
  assert.strictEqual(missingFields.success, false);
});
