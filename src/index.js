import pool from "./database.js";
import express from "express";
import health from "./handlers/health.handler.js";
import getBankStatement from "./handlers/bank-statement.handler.js";
import createTransaction from "./handlers/transaction.handler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    res.status(500).send();
}

app.use(errorHandler);

app.get('/health', health);
app.get('/clientes/:accountId/extrato', getBankStatement);
app.post('/clientes/:accountId/transacoes', createTransaction);

const server = app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
});

function gracefulShutdown(signal) {
    console.log(`Received ${signal}. Shutdown the server...`);
    server.close(async () => {
        console.log('HTTP server closed.');
        await pool.end();
        console.log('Postgres connection closed.');
        process.exit(0);
    });
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
