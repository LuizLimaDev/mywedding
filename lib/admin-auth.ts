import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "wedding_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getAdminUsername() {
  return process.env.ADMIN_USERNAME ?? "admin";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "change-this-admin-session-secret";
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function makeToken(username: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = `${username}.${issuedAt}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function verifyToken(token?: string) {
  if (!token) {
    return false;
  }

  const [username, issuedAtRaw, signature] = token.split(".");

  if (!username || !issuedAtRaw || !signature) {
    return false;
  }

  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (now - issuedAt > SESSION_MAX_AGE_SECONDS) {
    return false;
  }

  const expected = sign(`${username}.${issuedAtRaw}`);
  if (!safeCompare(signature, expected)) {
    return false;
  }

  return safeCompare(username, getAdminUsername());
}

export function validateAdminCredentials(username: string, password: string) {
  return safeCompare(username, getAdminUsername()) && safeCompare(password, getAdminPassword());
}

export async function createAdminSession(username: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: makeToken(username),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyToken(token);
}
