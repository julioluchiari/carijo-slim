import pool from "./database.js";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT NOW()');
        res.json({ currentTime: rows[0].now });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao acessar o banco de dados');
    }
});

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
