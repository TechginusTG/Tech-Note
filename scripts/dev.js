#!/usr/bin/env node
import { execSync } from "child_process";

function run(cmd, opts = {}) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit", shell: true, ...opts });
}

async function main() {
  try {
    // 1) try to start DB via docker compose, fallback to docker-compose
    try {
      run("docker compose up -d");
    } catch (e) {
      try {
        run("docker-compose up -d");
      } catch (e2) {
        console.warn(
          "Could not start DB with docker-compose. If you need a DB, start it manually (see docker-compose.yml).",
        );
      }
    }

    console.log("\nWaiting for DB to start (5s)...");
    await new Promise((r) => setTimeout(r, 5000));

    // 2) Run prisma migrate
    try {
      // Use `db push` to avoid interactive prompts on first run. It applies the schema directly.
      run("npx prisma db push");
    } catch (e) {
      console.warn(
        "Prisma db push failed or skipped. If this is the first run, ensure Prisma is installed and DATABASE_URL is set.",
      );
    }

    // 3) Run seed script (JS). A JS seed is included so node can run it directly.
    try {
      run("node prisma/seeds.ts");
    } catch (e) {
      console.warn(
        "Seeding failed or skipped. You can run `node prisma/seeds.js` manually later.",
      );
    }

    // 4) Start frontend
    run("npm run dev:frontend");
  } catch (err) {
    console.error("Dev runner failed:", err);
    process.exit(1);
  }
}

main();
