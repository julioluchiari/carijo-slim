import pool from '../database.js';

const transactionTypes = ['c', 'd'];

export default async function createTransaction (req, res, next) {
    const { accountId } = req.params;

    console.log(JSON.stringify(req.body))

    if (!parseInt(accountId) > 0) {
        return res.status(400).send();
    }

    if (!transactionTypes.includes(req.body.tipo)) {
        return res.status(422).send();
    }

    if (req.body.descricao === undefined || req.body.descricao === null || req.body.descricao.length === 0 || req.body.descricao.length > 10) {
        return res.status(422).send();
    }

    if (!Number.isInteger(req.body.valor) || parseInt(req.body.valor) <= 0) {
        return res.status(422).send();
    }

    const transactionAmount = parseInt(req.body.valor);

    try {
        await pool.query('BEGIN')

        const { rows } = await pool.query(`
            SELECT a.id, b.amount, a.limit_amount, b.id as balance_id
            FROM accounts a
            INNER JOIN balances b ON a.id = b.account_id
            WHERE a.id = $1
            FOR UPDATE
        `, [accountId]);

        if (!rows || rows.length === 0) {
            return res.status(404).send();
        }

        const amount = rows[0]['amount'];

        const newAmount =
            req.body.tipo === 'c'
                ? amount + transactionAmount
                : amount - transactionAmount;

        if (newAmount < rows[0]['limit_amount'] * -1) {
            return res.status(422).send();
        }

        await pool.query(`
            INSERT INTO transactions (amount, type, description, account_id)
            VALUES ($1, $2, $3, $4)
        `, [transactionAmount, req.body.tipo, req.body.descricao, accountId]);

        await pool.query(`
            UPDATE balances
            SET amount = $1
            WHERE id = $2
        `, [newAmount, rows[0]['balance_id']]);

        await pool.query('COMMIT');

        return res.status(200).json({
            limite: rows['limit_amount'],
            saldo: newAmount,
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('error creating transaction', error);
        next(error);
    }
}
