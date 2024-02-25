import pool from "../database.js"

export default async function getBankStatement(req, res, next) {
    const { accountId } = req.params;

    if (!parseInt(accountId) > 0) {
        return res.status(400).send();
    }

    try {
        const query = `
            SELECT a.limit_amount, b.amount as b_amount, t.amount as t_amount, t.type, t.created_at, t.description
            FROM accounts a
            INNER JOIN balances b ON a.id = b.account_id
            LEFT JOIN transactions t ON a.id = t.account_id
            WHERE a.id = $1
            ORDER BY t.created_at DESC
            LIMIT 10
        `;

        const { rows } = await pool.query(query, [accountId]);

        if (!rows || rows.length === 0) {
            console.log('here');
            return res.status(404).json({ status: 'not found' });
        }

        const now = new Date();

        const existsTransactions = rows.some((row) => row['t_amount'] !== null);

        const response = {
            saldo: {
                total: rows[0]['b_amount'],
                data_extrato: now.toISOString(),
                limite: rows[0]['limit_amount'],
            },
            ultimas_transacoes: existsTransactions ? rows.map((row) => ({
                valor: row['t_amount'],
                tipo: row['type'],
                descricao: row['description'],
                realizada_em: row['created_at'],
            })) : [],
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('error fetching bank statement', error);
        next(error);
    }
}
