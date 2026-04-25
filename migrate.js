const db = require("./server/db");

async function migrate() {
  try {
    await db.query(`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
    await db.query(`ALTER TABLE challenges ADD COLUMN IF NOT EXISTS subject VARCHAR(100)`);
    await db.query(`ALTER TABLE challenges ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20)`);
    await db.query(`ALTER TABLE challenges ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
    console.log("Migration successful.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

migrate();
