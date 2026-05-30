import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

export async function getToolBySlug(slug: string) {
  const result = await query(
    `SELECT t.*, 
      COALESCE(
        json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'icon', c.icon)) 
        FILTER (WHERE c.id IS NOT NULL), 
        '[]'::json
      ) as categories
    FROM tools t
    LEFT JOIN tool_categories tc ON t.id = tc.tool_id
    LEFT JOIN categories c ON tc.category_id = c.id
    WHERE t.slug = $1
    GROUP BY t.id`,
    [slug]
  )
  return result.rows[0] || null
}

export async function getAllTools(options?: {
  category?: string
  featured?: boolean
  search?: string
  limit?: number
  offset?: number
}) {
  let sql = `SELECT t.*, 
    COALESCE(
      json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'icon', c.icon)) 
      FILTER (WHERE c.id IS NOT NULL), 
      '[]'::json
    ) as categories
  FROM tools t
  LEFT JOIN tool_categories tc ON t.id = tc.tool_id
  LEFT JOIN categories c ON tc.category_id = c.id`
  
  const conditions: string[] = []
  const params: any[] = []
  let paramIndex = 1

  if (options?.category) {
    conditions.push(`c.slug = $${paramIndex++}`)
    params.push(options.category)
  }

  if (options?.featured) {
    conditions.push(`t.featured = true`)
  }

  if (options?.search) {
    conditions.push(`(t.name ILIKE $${paramIndex} OR t.tagline ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`)
    params.push(`%${options.search}%`)
    paramIndex++
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`
  }

  sql += ` GROUP BY t.id ORDER BY t.featured DESC, t.rating DESC NULLS LAST`

  if (options?.limit) {
    sql += ` LIMIT $${paramIndex++}`
    params.push(options.limit)
  }
  if (options?.offset) {
    sql += ` OFFSET $${paramIndex++}`
    params.push(options.offset)
  }

  const result = await query(sql, params)
  return result.rows
}

export async function getCategoryBySlug(slug: string) {
  const result = await query('SELECT * FROM categories WHERE slug = $1', [slug])
  return result.rows[0] || null
}

export async function getAllCategories() {
  const result = await query('SELECT * FROM categories ORDER BY sort_order ASC')
  return result.rows
}

export async function getToolsByCategory(categorySlug: string) {
  const result = await query(
    `SELECT t.*, 
      COALESCE(
        json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'icon', c.icon)) 
        FILTER (WHERE c.id IS NOT NULL), 
        '[]'::json
      ) as categories
    FROM tools t
    INNER JOIN tool_categories tc ON t.id = tc.tool_id
    INNER JOIN categories c ON tc.category_id = c.id
    WHERE c.slug = $1
    GROUP BY t.id
    ORDER BY t.featured DESC, t.rating DESC NULLS LAST`,
    [categorySlug]
  )
  return result.rows
}

export async function createLead(email: string, type = 'newsletter', name?: string, message?: string) {
  const result = await query(
    'INSERT INTO leads (email, type, name, message) VALUES ($1, $2, $3, $4) RETURNING id',
    [email, type, name || null, message || null]
  )
  return result.rows[0]
}

export async function createSubmission(name: string, email: string, toolName: string, toolUrl: string, description?: string, pricing?: string) {
  const result = await query(
    'INSERT INTO submissions (name, email, tool_name, tool_url, description, pricing) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [name, email, toolName, toolUrl, description || null, pricing || null]
  )
  return result.rows[0]
}

export async function incrementToolVisit(slug: string) {
  await query('UPDATE tools SET visit_count = visit_count + 1 WHERE slug = $1', [slug])
}

export default { query, getToolBySlug, getAllTools, getCategoryBySlug, getAllCategories, getToolsByCategory, createLead, createSubmission, incrementToolVisit }
