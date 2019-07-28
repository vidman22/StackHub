// Update with your config settings.
const types = require('pg').types;

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'johnvidmar',
      password: 'stackpass',
      database: 'stackhub',
      timezone: 'UTC'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
    debug: true
  },

  staging: {
    client: 'pg',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
