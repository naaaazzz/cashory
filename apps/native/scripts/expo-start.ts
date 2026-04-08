const extraArgs = process.argv.slice(2);

const processHandle = Bun.spawn({
  cmd: ["bunx", "expo", "start", ...extraArgs],
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
