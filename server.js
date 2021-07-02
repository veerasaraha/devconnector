const express = require('express')
const connectDB = require('./config/db')
const userRouter = require('./api/users')
const authRouter = require('./api/auth')
const profileRouter = require('./api/pofile')
const postRouter = require('./api/posts')

const app = express()

//DB Connection
connectDB()

app.get('/', (req, res) => {
  res.send(200).json({ message: 'Server Running' })
})

// Routes
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/posts', postRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
