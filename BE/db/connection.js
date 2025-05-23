const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE set");
}

const config = {};

console.log("PGDATABASE:", process.env.PGDATABASE);

module.exports = new Pool(config);
