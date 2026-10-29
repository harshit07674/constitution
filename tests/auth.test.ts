import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from "../lib/auth/jwt.ts";
import { registerSchema, loginSchema } from "../lib/validation/schemas.ts";

test("Password hashing and verification", async () => {
  const plain = "SuperSecretPassword123!";
  const hash = await hashPassword(plain);

  assert.notStrictEqual(plain, hash);
  assert.ok(hash.startsWith("$2"));

  const isValid = await verifyPassword(plain, hash);
  assert.strictEqual(isValid, true);

  const isInvalid = await verifyPassword("WrongPassword123!", hash);
  assert.strictEqual(isInvalid, false);
});

test("Registration input validation", () => {
  // Valid registration
  const valid = registerSchema.safeParse({
    name: "Marcus Aurelius",
    email: "marcus@rome.gov",
    password: "EmperorPassword123",
  });
  assert.strictEqual(valid.success, true);

  // Too short name
  const shortName = registerSchema.safeParse({
    name: "M",
    email: "marcus@rome.gov",
    password: "EmperorPassword123",
  });
  assert.strictEqual(shortName.success, false);

  // Invalid email
  const badEmail = registerSchema.safeParse({
    name: "Marcus Aurelius",
    email: "not-an-email",
    password: "EmperorPassword123",
  });
  assert.strictEqual(badEmail.success, false);

  // Too short password
  const shortPassword = registerSchema.safeParse({
    name: "Marcus Aurelius",
    email: "marcus@rome.gov",
    password: "short",
  });
  assert.strictEqual(shortPassword.success, false);
});

test("Login input validation", () => {
  const valid = loginSchema.safeParse({
    email: "marcus@rome.gov",
    password: "anyPassword",
  });
  assert.strictEqual(valid.success, true);

  const invalid = loginSchema.safeParse({
    email: "invalid-email",
    password: "",
  });
  assert.strictEqual(invalid.success, false);
});

test("JWT Session Token creation and verification", async () => {
  const payload = {
    userId: "uuid-1234-5678",
    email: "test@example.com",
    name: "Test User",
  };

  const token = await createSessionToken(payload);
  assert.ok(typeof token === "string");
  assert.ok(token.length > 20);

  const decoded = await verifySessionToken(token);
  assert.ok(decoded !== null);
  assert.strictEqual(decoded.userId, payload.userId);
  assert.strictEqual(decoded.email, payload.email);
  assert.strictEqual(decoded.name, payload.name);

  // Tampered token verification fails safely
  const tampered = token.slice(0, -5) + "abcde";
  const decodedTampered = await verifySessionToken(tampered);
  assert.strictEqual(decodedTampered, null);
});
