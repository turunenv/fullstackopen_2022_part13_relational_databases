require('dotenv').config()
const express = require('express')

// import the model and call the sync-method to create the db-table if it doesn't exist
const Blog = require('./models/Blog')
Blog.sync()

const app = express()
app.use(express.json())

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  console.log(req.body)
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  const id = req.params.id
  await Blog.destroy({ where: { id, } })
  return res.status(204).send()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})