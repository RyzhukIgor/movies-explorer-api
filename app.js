const express = require('express');
const mongoose = require('mongoose');
const { PORT, DB_URL } = require('./utils/configurations');

const app = express();

mongoose.connect(DB_URL);

app.listen(PORT);
