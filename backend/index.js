const express = require("express");
const dbconnect = require("../config/db");
const authroute = require("../routes/authroutes");
const cookiesparser = require("cookie-parser");
const cors = require("cors");
const userroute = require("../routes/userroutes");
const postroutes = require("../routes/Postroutes");
const connectionroute = require("../routes/Coneectionroutes");

const app = express();
require('dotenv').config();

app.use(cookiesparser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

dbconnect();
app.use(express.json());

// Routes
app.use('/api/connections', connectionroute);
app.use('/api', userroute);
app.use('/api', authroute);
app.use('/api', postroutes);

// 👇 Vercel me app.listen() use nahi karna
module.exports = app;
