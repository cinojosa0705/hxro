const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Sales_DB",
  password: "ModerkDB",
  port: 5432,
});

const getSlots = () => {
  return new Promise(function (resolve, reject) {
    pool.query(
      `SELECT * FROM "parivolslots" ORDER BY id ASC`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows);
      }
    );
  });
};
const createSlots = (body) => {
  return new Promise(function (resolve, reject) {
    const { volume, slot } = body;
    pool.query(
      `INSERT INTO "parivolslots" (volume, time) VALUES ($1, $2) RETURNING *`,
      [volume, slot],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`A new merchant has been added added: ${results.rows[0]}`);
      }
    );
  });
};
const deleteSlots = () => {
  return new Promise(function (resolve, reject) {
    const id = parseInt(request.params.id);
    pool.query(
      `DELETE FROM "parivolslots" WHERE id = $1`,
      [id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`Merchant deleted with ID: ${id}`);
      }
    );
  });
};

module.exports = {
  getSlots,
  createSlots,
  deleteSlots,
};
