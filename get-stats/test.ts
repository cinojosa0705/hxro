import { Client } from "pg";

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "ModerkDB",
  database: "Sales_DB",
});

client.connect();

const arr = [1, 2, 3, 4, 5, 6, 7, 8]

async function main() {
  const lastVol = (await client.query(`SELECT volume FROM "paricumvol"`)).rows;
  const lastVolume = lastVol[lastVol.length - 1].volume

  console.log(`Previous volume: ${lastVol}`);

  const volume = lastVolume + 1000

  client.query(`INSERT INTO "paricumvol"(volume, time) VALUES(${volume}, CURRENT_TIMESTAMP)`)

  console.log(`New volume: ${lastVol}`);
}

Promise.all(arr.map(() => main())).then(() => {
  client.end();
});

// Markets.forEach(async (e) => {
    //   let long = e.info.parimutuel.activeLongPositions.toNumber() / usdcDec;
    //   let short = e.info.parimutuel.activeShortPositions.toNumber() / usdcDec;
    //   let volume = long + short;
    //   let slot = e.info.parimutuel.slot.toNumber();

    //   const insertRecord = async (slot: number, volume: number) => {
    //     try {
    //       // First, check if the slot number already exists in the table
    //       const result = await client.query(
    //         'SELECT * FROM "parivolslots" WHERE slot = $1',
    //         [slot]
    //       );
    //       if (result.rowCount > 0) {
    //         // The slot number already exists, so we cannot insert a new record
    //         return;
    //       }
    //       // The slot number does not exist, so we can insert the new record
    //       await client.query(
    //         'INSERT INTO "parivolslots" (slot, volume, time) VALUES ($1, $2, CURRENT_TIMESTAMP)',
    //         [slot, volume]
    //       );
    //       return;
    //     } catch (err) {
    //       // An error occurred, so we return false
    //       return false;
    //     }
    //   };

    // await insertRecord(slot, volume)
    // });