import pool from "./database.js";
import express from "express";
import health from "./handlers/health.handler.js";
import getBankStatement from "./handlers/bank-statement.handler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', health);
app.get('/clientes/:accountId/extrato', getBankStatement);

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
