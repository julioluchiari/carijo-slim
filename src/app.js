const express = require("express");
const { health } = require("./handlers/health.handler.js");
const { getBankStatement } = require("./handlers/bank-statement.handler.js");
const { createTransaction } = require("./handlers/transaction.handler.js");

const app = express();

app.use(express.json());

function errorHandler(err, req, res, next) {
  console.error("Error:", err);
  res.status(500).send();
}

app.use(errorHandler);

app.get("/health", health);
app.get("/clientes/:accountId/extrato", getBankStatement);
app.post("/clientes/:accountId/transacoes", createTransaction);

module.exports = app;
