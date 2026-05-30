const { Pool } = require('pg');
const { categories, tools } = require('./seed-data');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

async function main() {
  console.log('🌱 Seeding database...\n');

  // Clear existing data
  await query('DELETE FROM tool_categories');
  await query('DELETE FROM reviews');
  await query('DELETE FROM leads');
  await query('DELETE FROM submissions');
  await query('DELETE FROM tools');
  await query('DELETE FROM categories');

  // Insert categories
  console.log(`📁 Creating ${categories.length} categories...`);
  for (const cat of categories) {
    await query(
      `INSERT INTO categories (name, slug, description, icon, sort_order) 
       VALUES ($1, $2, $3, $4, $5)`,
      [cat.name, cat.slug, cat.description, cat.icon, cat.sortOrder]
    );
    console.log(`  ✅ ${cat.name}`);
  }

  // Insert tools
  console.log(`\n🔧 Creating ${tools.length} tools...`);
  for (const toolData of tools) {
    const { categories: catNames, ...tool } = toolData;
    
    const result = await query(
      `INSERT INTO tools (name, slug, tagline, description, logo_url, website_url, 
        affiliate_url, affiliate_program, commission_rate, pricing_tier, 
        starting_price, is_free, featured, rating, reviews_count,
        best_for, subjects, grade_levels, curriculum, languages)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
       RETURNING id`,
      [tool.name, tool.slug, tool.tagline, tool.description, tool.logoUrl || null,
       tool.websiteUrl, tool.affiliateUrl || null, tool.affiliateProgram || null,
       tool.commissionRate || null, tool.pricingTier, tool.startingPrice || null,
       tool.isFree || false, tool.featured || false, tool.rating || null, tool.reviewsCount || 0,
       tool.bestFor || [], tool.subjects || [], tool.gradeLevels || [],
       tool.curriculum || [], tool.languages || []]
    );
    
    const toolId = result.rows[0].id;

    // Link categories
    for (const catName of catNames) {
      const catResult = await query('SELECT id FROM categories WHERE slug = $1', [catName]);
      if (catResult.rows[0]) {
        await query(
          'INSERT INTO tool_categories (tool_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [toolId, catResult.rows[0].id]
        );
      }
    }

    console.log(`  ✅ ${tool.name}`);
  }

  console.log('\n✅ Seeding complete!');
  console.log(`   ${categories.length} categories`);
  console.log(`   ${tools.length} tools`);

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
