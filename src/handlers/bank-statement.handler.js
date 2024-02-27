const { pool } = require("../database.js");

async function getBankStatement(req, res, next) {
  const accountId = parseInt(req.params["accountId"]);

  if (!accountId > 0) {
    return res.status(400).send();
  }

  const client = await pool.connect();

  try {
    const query = `
            SELECT a.limit_amount, a.balance as b_amount, t.amount as t_amount, t.type, t.created_at, t.description
            FROM accounts a
            LEFT JOIN transactions t ON a.id = t.account_id
            WHERE a.id = $1
            ORDER BY t.created_at DESC
            LIMIT 10
        `;

    const { rows } = await client.query(query, [accountId]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ status: "not found" });
    }

    const now = new Date();

    const existsTransactions = rows.some((row) => row["t_amount"] !== null);

    const response = {
      saldo: {
        total: rows[0]["b_amount"],
        data_extrato: now.toISOString(),
        limite: rows[0]["limit_amount"],
      },
      ultimas_transacoes: existsTransactions
        ? rows.map((row) => ({
            valor: row["t_amount"],
            tipo: row["type"],
            descricao: row["description"],
            realizada_em: row["created_at"],
          }))
        : [],
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  } finally {
    client.release();
  }
}

module.exports = { getBankStatement };
