require('dotenv').config();

const { PORT = 3000 } = process.env;
const { DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const { NODE_ENV } = process.env;
const { JWT_SECRET_PROD } = process.env;

const JWT_SECRET = NODE_ENV === 'production' ? JWT_SECRET_PROD : 'dev-secret';

module.exports = {
  PORT,
  DB_URL,
  JWT_SECRET,
};
