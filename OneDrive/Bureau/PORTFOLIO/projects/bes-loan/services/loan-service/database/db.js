const knex = require('knex');
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './database/loans.db'
    },
    useNullAsDefault: true 
});

db.schema.hasTable('loans').then(exists => {
    if (!exists) {
        return db.schema.createTable('loans', table => {
            table.increments('id').primary();
            table.integer('user_id').notNullable();
            table.decimal('amount').notNullable();
            table.decimal('remaining_amount').notNullable();
            table.string('purpose').notNullable();
            table.date('loan_date').notNullable();
            table.date('due_date').notNullable();
            table.string('status').defaultTo('pending');  // pending, approved, rejected, active, paid
            table.timestamp('created_at').defaultTo(db.fn.now());
        });
    }
});

module.exports = db;