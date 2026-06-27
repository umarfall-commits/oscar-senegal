const { createClient } = require('@libsql/client');

const url = process.env.DATABASE_URL;
if (!url || !url.startsWith('libsql://')) {
  console.error('DATABASE_URL must be a libsql:// URL');
  process.exit(1);
}

async function setup() {
  const client = createClient({ url });

  console.log('Connecting to Turso...');

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Engagement" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "fullname" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "phone" TEXT,
      "region" TEXT NOT NULL,
      "comment" TEXT,
      "ambassador" BOOLEAN NOT NULL DEFAULT 0,
      "newsletter" BOOLEAN NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Table Engagement created');

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Contribution" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "author" TEXT NOT NULL,
      "region" TEXT,
      "theme" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "upvotes" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Table Contribution created');

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Download" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "fileType" TEXT NOT NULL,
      "fileName" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Table Download created');

  // Verify
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('\n📊 Tables in Turso database:');
  tables.rows.forEach(r => console.log('  -', r.name));

  await client.close();
  console.log('\n🎉 Turso database is ready!');
}

setup().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});