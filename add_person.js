const pg = require("pg");
const settings = require("./settings"); // settings.json

// Store name in 'arg' variable for convenience later
const args = process.argv.slice(2, 5);

let bdate;

try{
  bdate = new Date(Date.parse(args[2]));
} catch(e) {
  console.error("Failed to parse date given!")
  throw e
}

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: settings.hostname,
    user: settings.user,
    password: settings.password,
    database: settings.database,
    port: settings.port
  }
});

knex('famous_people').insert({
    "first_name": args[0],
    "last_name": args[1],
    "birthdate": bdate
  })
  .from("famous_people")
  .then(() => {
    console.log(`Data inserted:\n${args}`);
  })
  .catch((err) => {
    throw err;
  })
  .finally(() => {
    knex.destroy();
  })