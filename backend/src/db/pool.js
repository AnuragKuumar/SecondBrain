import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

console.log('Database URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

pool.on('error', (err) => {
  console.error('Database error:', err)
})
