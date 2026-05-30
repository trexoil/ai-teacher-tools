const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log('📦 Pushing schema to database...');
  
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  
  try {
    await pool.query(schemaSql);
    console.log('✅ Schema pushed successfully!');
  } catch (err) {
    console.error('❌ Error pushing schema:', err.message);
    process.exit(1);
  }

  await pool.end();
}

main();
