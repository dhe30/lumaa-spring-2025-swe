import pg from 'pg'
const { Pool } = pg
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
   connectionString: process.env.DB_CONNECTION_URL
})

export default pool