const settings = require("./settings"); // settings.json
const config = require('./knexfile');

// Store name in 'arg' variable for convenience later
const arg = process.argv[2];

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

// const knex = require('knex')(config);

knex.select("first_name", "last_name", knex.raw("to_char(birthdate, 'YYYY-MM-DD') as birthdate"))
  .where("first_name", "like", `%${arg}%`)
  .orWhere("last_name", "like", `%${arg}%`)
  .from("famous_people")
  .then(function (res) {
      const numResults = res.length;
      if (numResults > 0) {
        const people = (numResults > 1 ? "people" : "person");
        let returnString = `Found ${numResults} ${people} by the name '${arg}:`;
        let count = 0;
        for (let person of res) {
          count += 1;
          returnString += `\n- ${count}: ${person.first_name} ${person.last_name}, born '${person.birthdate}'`
        }
        console.log(returnString);
      }
      else {
        console.log("No results found!");
      }
      })
    .finally(() => {
      knex.destroy();
    })