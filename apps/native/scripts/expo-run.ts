const [platform, ...extraArgs] = process.argv.slice(2);

if (!platform) {
  console.error("Missing platform. Usage: bun run ./scripts/expo-run.ts <android|ios> [...args]");
  process.exit(1);
}

const processHandle = Bun.spawn({
  cmd: ["bunx", "expo", `run:${platform}`, ...extraArgs],
  cwd: import.meta.dir + "/..",
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
  env: {
    ...process.env,
    EXPO_NO_DEPENDENCY_VALIDATION: "1",
  },
});

process.exit(await processHandle.exited);
