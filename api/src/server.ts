import "dotenv/config";
import { app } from "./app.js";
import { seedIfEmpty } from "./lib/seed.js";

const port = Number(process.env.PORT ?? 4000);

async function start() {
  try {
    await seedIfEmpty();
  } catch (err) {
    console.error("Seed failed:", err);
  }
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}

start();