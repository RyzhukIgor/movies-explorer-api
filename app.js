const express = require('express');
const mongoose = require('mongoose');
const { PORT, DB_URL } = require('./utils/configurations');
const routes = require('./routes/index');

const app = express();
app.use(routes);
mongoose.connect(DB_URL);

app.listen(PORT);
