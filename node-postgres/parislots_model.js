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

module.exports = {
  getSlots,
};
