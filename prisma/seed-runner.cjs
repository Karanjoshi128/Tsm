const fs = require("fs");
const path = require("path");

function loadDotEnv(dotenvPath) {
  if (!fs.existsSync(dotenvPath)) return;

  const content = fs.readFileSync(dotenvPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

// Prisma config disables Prisma CLI's automatic env loading.
// Load `.env` manually so DATABASE_URL is available.
loadDotEnv(path.join(process.cwd(), ".env"));

require("ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "CommonJS",
    moduleResolution: "node",
    esModuleInterop: true,
    target: "ES2019",
  },
});

require(path.join(__dirname, "seed.ts"));
