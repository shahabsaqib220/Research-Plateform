const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const userRouter = require('./modules/userRegistration/mainRouter');
const errorHandler = require('./modules/userLogin/middleware');
const userLoginRouter = require('./modules/userLogin/mainRouter');
const userResetPasswordRouter = require('./modules/userForgetPassword/mainRouter');
const connectDB = require('./db');
const initGridFS = require('./configurations/firebase_Configuraion/gridFsConfig');
const addResearchRouter = require("./modules/admin-user-reseach-information/router");
const groupMemberRouter = require('./modules/admin-add-group-memeber/router');
const groupMemberLoginRouter = require('./modules/group-member-login/router');
const GroupMemberContribution = require("./modules/group-member-contributions/router")
const checkReseachInformationRouter = require('./modules/check-group-information/router');
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configure CORS properly for Vercel
app.use(cors({
  origin: '*', // Change this to your frontend domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

connectDB();
const { upload, gfs } = initGridFS();

// ✅ Remove WebSocket logic (Vercel does not support WebSockets)

// ✅ Add default route for testing
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// ✅ Define API Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/login', userLoginRouter);
app.use('/api/v1/password', userResetPasswordRouter);
app.use('/api/v1/group', addResearchRouter);
app.use('/api/v1/groupmember', groupMemberRouter);
app.use('/api/v1/member', groupMemberLoginRouter);
app.use('/api/v1/check/research', checkReseachInformationRouter);
app.use('/api/v1/groupmember/research', GroupMemberContribution);

// ✅ Global Error Handler
app.use(errorHandler);

// ❌ REMOVE app.listen() – Vercel does not need this
// ❌ REMOVE WebSocket server setup

// ✅ Export Express app for Vercel
module.exports = app;
