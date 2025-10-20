const knex = require('knex');
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './database/payments.db'
    },
    useNullAsDefault: true 
});

db.schema.hasTable('payments').then(exists => {
    if (!exists) {
        return db.schema.createTable('payments', table => {
            table.increments('id').primary();
            table.integer('loan_id').notNullable();
            table.integer('user_id').notNullable();
            table.decimal('amount').notNullable();
            table.timestamp('payment_date').defaultTo(db.fn.now());
            table.string('payment_method').notNullable();
            table.string('transaction_id').notNullable();
        });
    }
});

module.exports = db;