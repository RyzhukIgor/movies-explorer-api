const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Connected');
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(PORT, () => {
  console.log(`Listing on port ${PORT}`);
});
