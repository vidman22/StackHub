
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id');
        table.string('username');
        table.string('uuid');
        table.string('email');
        table.string('password');
        table.string('stripe_token');
        table.string('free_trial');
        table.timestamp('created_at', { precision: 6}).defaultTo(knex.fn.now(6));
        table.timestamp('updated_at', { precision: 6}).defaultTo(knex.fn.now(6));
     })
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.raw('DROP TABLE users CASCADE')
    ]);
};
