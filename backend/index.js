const express = require("express")
const dbconnect = require("./config/db")
const authroute = require("./routes/authroutes")
const cookiesparser = require("cookie-parser")
const cors = require("cors")
const userroute = require("./routes/userroutes")
const postroutes = require("./routes/Postroutes")
const connectionroute = require("./routes/Coneectionroutes")

const app = express()
require('dotenv').config()

app.use(cookiesparser())

app.use(cors({
  origin: process.env.CLIENT_URL ,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const PORT = process.env.PORT || 4000
dbconnect()
app.use(express.json())


// Make sure you're mounting the routes with the correct base path
app.use('/api/connections', connectionroute); // This will make all routes start with /api/connections
app.use('/api', userroute); // User routes will start with /api
app.use('/api', authroute); // Auth routes will start with /api
app.use('/api', postroutes); // Post routes will start with /api

app.listen(PORT, () => {
  console.log(`your server was run ${PORT}`)
})