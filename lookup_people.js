const pg = require("pg");
const settings = require("./settings"); // settings.json

// Store name in 'arg' variable for convenience later
const arg = process.argv[2];

const client = new pg.Client({
  user: settings.user,
  password: settings.password,
  database: settings.database,
  host: settings.hostname,
  port: settings.port,
  ssl: settings.ssl
});

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  console.log("Successfully connected to the database!")
  client.query("SELECT first_name, last_name, TO_CHAR(birthdate, 'YYYY-MM-DD') as birthdate from famous_people WHERE UPPER(first_name) like UPPER($1) OR UPPER(last_name) like UPPER($1);", [arg], (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    console.log('Searching...');
    // In the wild, sanitize this!
    const numResults = result.rows.length;
    if (numResults > 0) {
      const people = (numResults > 1 ? "people" : "person");
      let returnString = `Found ${numResults} ${people} by the name '${arg}:`;
      let count = 0;
      for (let person of result.rows) {
        count += 1;
        console.log(person.birthdate);
        returnString += `\n- ${count}: ${person.first_name} ${person.last_name}, born '${person.birthdate}'`
      }
      console.log(returnString);
    }
    client.end();
  });
});