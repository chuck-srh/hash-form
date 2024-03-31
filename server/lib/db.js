const knexStringcase = require("knex-stringcase");

module.exports = require("knex")(knexStringcase({
    client: "pg",
    connection: "postgres://srhreports:postgres@hashdemo-postgres:5432/postgres"
}));
  