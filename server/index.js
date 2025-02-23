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
const { broadcastMessage, wss } = require('./websocketServer'); // Import WebSocket utilities
const WebSocket = require('ws');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));

const PORT = 5000;
app.use(errorHandler);


connectDB();
const { upload, gfs } = initGridFS();

wss.on('connection', (ws) => {
  console.log('WebSocket Client connected');
});


app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/login', userLoginRouter);
app.use('/api/v1/password', userResetPasswordRouter);
app.use('/api/v1/group', addResearchRouter);
app.use('/api/v1/groupmember', groupMemberRouter);
app.use('/api/v1/member', groupMemberLoginRouter);
app.use('/api/v1/check/research', checkReseachInformationRouter);
app.use('/api/v1/groupmember/research', GroupMemberContribution);



module.exports = app;