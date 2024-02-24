import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    user: 'yourUser',
    host: 'localhost',
    database: 'yourDatabase',
    password: 'yourPassword',
    port: 5432,
});

export default pool;
