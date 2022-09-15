const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: `${path.resolve(__dirname, '../../.env')}` });

const pool = new Pool({
  user: `${process.env.DATABASE_USER}`,
  host: `${process.env.DATABASE_HOST}`,
  database: `${process.env.DATABASE_NAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  port: `${
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_PORT
      : process.env.DATABASE_PORT
  }`,
});

pool.on('error', (err) => {
  console.log(err);
  throw new Error({ statusCode: 500, message: err });
});

module.exports = { pool };
