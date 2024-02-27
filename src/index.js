const { pool } = require("./database.js");
const app = require("./app.js");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});

function gracefulShutdown(signal) {
  console.log(`Received ${signal}. Shutdown the server...`);
  server.close(async () => {
    console.log("HTTP server closed.");
    await pool.end();
    console.log("Postgres connection closed.");
    process.exit(0);
  });
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
