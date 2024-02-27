const request = require("supertest");
const { pool } = require("../src/database.js");
const app = require("../src/app.js");

beforeEach(async () => {
  await pool.query("DELETE FROM transactions");
  await pool.query("DELETE FROM accounts");
  await pool.query(
    "INSERT INTO accounts (id, name, balance, limit_amount) VALUES (1, 'rinha', 0, 1000)",
  );
});

afterAll(async () => {
  pool.end();
});

describe("GET /clientes/:accountId/extrato", () => {
  it("returns bank statement for valid account id", async () => {
    const response = await request(app).get("/clientes/1/extrato");
    expect(response.statusCode).toBe(200);
  });

  it("returns 404 for invalid account id", async () => {
    const response = await request(app).get("/clientes/9999/extrato");
    expect(response.statusCode).toBe(404);
  });
});

describe("POST /clientes/:accountId/transacoes", () => {
  it("creates credit transaction for valid input", async () => {
    const response = await request(app)
      .post("/clientes/1/transacoes")
      .send({ tipo: "c", descricao: "test", valor: 100 });
    expect(response.statusCode).toBe(200);
    expect(response.body['saldo']).toEqual(100);
  });

  it("creates debit transaction for valid input", async () => {
    const response = await request(app)
      .post("/clientes/1/transacoes")
      .send({ tipo: "d", descricao: "test", valor: 100 });
    expect(response.statusCode).toBe(200);
    expect(response.body['saldo']).toEqual(-100);
  });

  it("returns 422 for invalid transaction type", async () => {
    const response = await request(app)
      .post("/clientes/1/transacoes")
      .send({ tipo: "x", descricao: "test", valor: 100 });
    expect(response.statusCode).toBe(422);
  });

  it("returns 422 for invalid transaction amount", async () => {
    const response = await request(app)
      .post("/clientes/1/transacoes")
      .send({ tipo: "c", descricao: "test", valor: -100 });
    expect(response.statusCode).toBe(422);
  });

  it("returns 422 for invalid transaction description", async () => {
    const response = await request(app)
      .post("/clientes/1/transacoes")
      .send({ tipo: "c", descricao: "", valor: 100 });
    expect(response.statusCode).toBe(422);
  });
});

describe("GET /health", () => {
  it("returns 200 for health check", async () => {
    const response = await request(app).get("/health");
    expect(response.statusCode).toBe(200);
  });
});
