const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("🚀 Server is Running!");
});

// Instead of `app.listen()`, EXPORT the app
module.exports = app;
