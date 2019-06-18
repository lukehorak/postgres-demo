
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('milestones', (table) => {
      table.increments('id');
      table.string('description');
      table.date('date_achieved');
      table.integer('famous_id');

      table.foreign('famous_id').references('id').inTable('famous_people');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('milestones')
  ])
};
