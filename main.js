// server.js
import express from 'express'
import { runAllTests } from './tests.js'

const app = express()
const port = 3000

app.get('/tests', async (req, res) => {
  try {
    const results = await runAllTests()
    res.json(results)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
