const { pool } = require("../database.js");

const transactionTypes = ["c", "d"];

async function createTransaction(req, res, next) {
  const accountId = parseInt(req.params["accountId"]);

  if (!accountId > 0) {
    return res.status(400).send();
  }

  if (!transactionTypes.includes(req.body.tipo)) {
    return res.status(422).send();
  }

  if (
    req.body.descricao === undefined ||
    req.body.descricao === null ||
    req.body.descricao.length === 0 ||
    req.body.descricao.length > 10
  ) {
    return res.status(422).send();
  }

  if (!Number.isInteger(req.body.valor) || parseInt(req.body.valor) <= 0) {
    return res.status(422).send();
  }

  const transactionAmount = parseInt(req.body.valor);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `
            SELECT a.id, a.balance, a.limit_amount
            FROM accounts a
            WHERE a.id = $1
            FOR UPDATE
        `,
      [accountId],
    );

    if (!rows || rows.length === 0) {
      return res.status(404).send();
    }

    const amount = rows[0]["balance"];

    const newAmount =
      req.body.tipo === "c"
        ? amount + transactionAmount
        : amount - transactionAmount;

    if (newAmount < rows[0]["limit_amount"] * -1) {
      await client.query("ROLLBACK");
      return res.status(422).send();
    }

    await client.query(
      `
            INSERT INTO transactions (amount, type, description, account_id)
            VALUES ($1, $2, $3, $4)
        `,
      [transactionAmount, req.body.tipo, req.body.descricao, accountId],
    );

    await client.query(
      `
            UPDATE accounts
            SET balance = $1
            WHERE id = $2
        `,
      [newAmount, rows[0]["id"]],
    );

    await client.query("COMMIT");

    return res.status(200).json({
      limite: rows[0]["limit_amount"],
      saldo: newAmount,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
}

module.exports = { createTransaction };
