const { pool } = require("../database.js");

async function health(req, res) {
  let timeoutTriggered = false;

  const timeoutId = setTimeout(() => {
    timeoutTriggered = true;
    console.error("database timeout triggered");
    res.status(500).json({ status: "timeout", database: "down" });
  }, 1000);

  pool.query("SELECT 1", (err, result) => {
    if (timeoutTriggered) {
      return;
    }
    clearTimeout(timeoutId);
    if (err) {
      console.error("database is down");
      return res.status(500).json({ status: "error", database: "down" });
    }
    res.status(200).json({ status: "ok", database: "up" });
  });
}

module.exports = { health };
