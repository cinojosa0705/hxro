const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Sales_DB",
  password: "ModerkDB",
  port: 5432,
});

const getDextTrg = () => {
  return new Promise(function (resolve, reject) {
    pool.query(`SELECT * FROM "dextrg" ORDER BY id ASC`, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results.rows);
    });
  });
};
const createDextTrg = (body) => {
  return new Promise(function (resolve, reject) {
    const { volume, slot } = body;
    pool.query(
      `INSERT INTO "dextrg" (trgtotal, time) VALUES ($1, $2) RETURNING *`,
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
const deleteDextTrg = () => {
  return new Promise(function (resolve, reject) {
    const id = parseInt(request.params.id);
    pool.query(`DELETE FROM "dextrg" WHERE id = $1`, [id], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(`Merchant deleted with ID: ${id}`);
    });
  });
};

module.exports = {
  getDextTrg,
  createDextTrg,
  deleteDextTrg,
};
