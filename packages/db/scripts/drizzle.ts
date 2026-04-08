import { lookup } from "node:dns/promises";
import dotenv from "dotenv";

dotenv.config({
  path: "../../apps/server/.env",
  quiet: true,
});

const command = process.argv[2];

if (!command) {
  console.error("Missing drizzle command. Usage: bun run ./scripts/drizzle.ts <push|generate|studio|migrate>");
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing. Set it in apps/server/.env and try again.");
  process.exit(1);
}

let hostname = "";

try {
  hostname = new URL(databaseUrl).hostname;
} catch {
  console.error("DATABASE_URL is not a valid URL. Check apps/server/.env and try again.");
  process.exit(1);
}

const isLocalHost = new Set(["localhost", "127.0.0.1", "::1"]).has(hostname);

if (!isLocalHost) {
  try {
    await lookup(hostname);
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "UNKNOWN";

    console.error(
      [
        `Cannot resolve database host "${hostname}" (${code}).`,
        "Check the DATABASE_URL in apps/server/.env.",
        "For Supabase, copy the connection string again from Project Settings -> Database.",
      ].join(" "),
    );
    process.exit(1);
  }
}

const drizzleProcess = Bun.spawn({
  cmd: ["bunx", "drizzle-kit", command],
  cwd: import.meta.dir + "/..",
  stdout: "inherit",
  stderr: "inherit",
  stdin: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: databaseUrl,
  },
});

const exitCode = await drizzleProcess.exited;

process.exit(exitCode);
