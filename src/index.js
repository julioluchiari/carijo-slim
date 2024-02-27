const { pool } = require("./database.js");
const express = require("express");
const { health } = require("./handlers/health.handler.js");
const { getBankStatement } = require("./handlers/bank-statement.handler.js");
const { createTransaction } = require("./handlers/transaction.handler.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function errorHandler(err, req, res, next) {
  console.error("Error:", err);
  res.status(500).send();
}

app.use(errorHandler);

app.get("/health", health);
app.get("/clientes/:accountId/extrato", getBankStatement);
app.post("/clientes/:accountId/transacoes", createTransaction);

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
