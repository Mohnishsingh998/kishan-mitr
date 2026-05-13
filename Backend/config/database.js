require('dotenv').config();

const useSQLite = process.env.USE_SQLITE === 'true' || !process.env.DB_HOST;

if (useSQLite) {
  module.exports = {
    development: {
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: false,
    },
    test: {
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    },
    production: {
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: false,
    },
  };
} else {
  module.exports = {
    development: {
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || null,
      database: process.env.DB_NAME || 'krishimitra_db',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: console.log,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    },
    test: {
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || null,
      database: process.env.DB_NAME + '_test' || 'krishimitra_test',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
    },
    production: {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000,
      },
    },
  };
}
