"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const client = new pg_1.Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "ModerkDB",
    database: "Sales_DB",
});
client.connect();
const arr = [1, 2, 3, 4, 5, 6, 7, 8];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const lastVol = (yield client.query(`SELECT volume FROM "paricumvol"`)).rows;
        const lastVolume = lastVol[lastVol.length - 1].volume;
        console.log(`Previous volume: ${lastVol}`);
        const volume = lastVolume + 1000;
        client.query(`INSERT INTO "paricumvol"(volume, time) VALUES(${volume}, CURRENT_TIMESTAMP)`);
        console.log(`New volume: ${lastVol}`);
    });
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
