const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { PORT, DB_URL } = require('./utils/configurations');
const routes = require('./routes/index');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(express.json());
app.use(routes);
app.use(errors);
app.use(errorMiddleware);

mongoose.connect(DB_URL);

app.listen(PORT);
