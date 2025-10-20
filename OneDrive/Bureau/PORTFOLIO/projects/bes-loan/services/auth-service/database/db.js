const knex = require('knex');
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './database/users.db'
    },
    useNullAsDefault: true 
});

db.schema.hasTable('users').then(exists => {
    if (!exists) {
        return db.schema.createTable('users', table => {
            table.increments('id').primary();
            table.string('username').notNullable().unique();
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.decimal('monthly_income').notNullable();
            table.timestamp('created_at').defaultTo(db.fn.now());
        });
    }
});

module.exports = db;