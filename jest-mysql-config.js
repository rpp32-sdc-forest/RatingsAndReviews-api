module.exports = {
  databaseOptions: {
    host: "localhost",
    port: 5000,
    user: "root",
    password: "password",
    database: "ratings"
  },
  createDatabase: true,
  dbSchema: "schema.sql",
  truncateDatabase: false
};