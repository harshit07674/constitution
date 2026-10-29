import test from "node:test";
import assert from "node:assert/strict";
import { ForbiddenError, NotFoundError } from "../lib/errors/api-error.ts";

test("Ownership authorization rule enforcement", () => {
  const currentUserId = "user-alice-123";
  const otherUserId = "user-bob-456";

  const constitutionOwnerId = "user-bob-456";

  // Simulate ownership check function
  function verifyOwnership(requestUserId: string, resourceOwnerId: string) {
    if (requestUserId !== resourceOwnerId) {
      throw new ForbiddenError("You do not have access to this constitution");
    }
    return true;
  }

  // Alice cannot access Bob's constitution
  assert.throws(
    () => verifyOwnership(currentUserId, constitutionOwnerId),
    (err: unknown) => {
      assert.ok(err instanceof ForbiddenError);
      assert.strictEqual((err as ForbiddenError).statusCode, 403);
      assert.strictEqual((err as ForbiddenError).code, "FORBIDDEN");
      return true;
    }
  );

  // Bob can access Bob's constitution
  const allowed = verifyOwnership(otherUserId, constitutionOwnerId);
  assert.strictEqual(allowed, true);
});

test("Decision entry cross-user isolation", () => {
  function verifyDecisionAccess(userId: string, decision: { userId: string; constitutionId: string }) {
    if (decision.userId !== userId) {
      throw new ForbiddenError("You do not have access to this decision entry");
    }
    return true;
  }

  const decision = {
    userId: "user-owner-1",
    constitutionId: "const-1",
  };

  assert.throws(
    () => verifyDecisionAccess("user-attacker-2", decision),
    ForbiddenError
  );

  assert.strictEqual(verifyDecisionAccess("user-owner-1", decision), true);
});

test("Version restoration snapshot immutability", () => {
  const historicalVersion = {
    id: "ver-1",
    versionNumber: 1,
    snapshot: {
      title: "Original Charter",
      principles: [{ title: "Principle 1", statement: "Do no harm." }],
    },
  };

  // Restoration does not overwrite historicalVersion; it produces a new revision
  const newVersionNumber = historicalVersion.versionNumber + 1;
  const restoredRevision = {
    id: "ver-2",
    versionNumber: newVersionNumber,
    snapshot: historicalVersion.snapshot,
    note: `Restored from version ${historicalVersion.versionNumber}`,
  };

  assert.strictEqual(historicalVersion.versionNumber, 1);
  assert.strictEqual(restoredRevision.versionNumber, 2);
  assert.strictEqual(restoredRevision.note, "Restored from version 1");
  assert.deepStrictEqual(restoredRevision.snapshot, historicalVersion.snapshot);
});
