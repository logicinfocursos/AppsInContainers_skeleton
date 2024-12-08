import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'
import dotenv from 'dotenv'
//import router from './routes/router.js'

dotenv.config()

const app = express()
const port = process.env.API_PORT || 3001
app.use(cors())
app.use(express.json())
//app.use(router)

/* const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
} */

const dbConfig = {
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'logicinfo',
  port: 3306
}

app.get('/databases', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig)
    const [rows] = await connection.query('SHOW DATABASES')
    res.json(rows)
  } catch (error) {
    res.status(500).send(error.toString())
  }
})

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`)
})