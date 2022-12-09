//node --loader ts-node/esm ./dex.ts
import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";
import dexterityTs from "@hxronetwork/dexterity-ts";
// @ts-ignore
const dexterity = dexterityTs.default;
// it has to look like this 'const dexterity = dexterity_ts_1.default;' or it won't work lol
import * as sdk from "@hxronetwork/parimutuelsdk";
import { Client } from "pg";

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "ModerkDB",
  database: "Sales_DB",
});

client.connect();

const rpc = "https://hxro.rpcpool.com/081597d8bb90b3da7fd354257950";
const keypair = Keypair.generate();
const wallet = new Wallet(keypair);
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const usdcDec = 1000000;

const dexterityVol = async () => {
  const manifest = await dexterity.getManifest(rpc, false, wallet);

  let vol = await dexterity.Fractional.From(
    manifest.fields.mpgs.get("HiCy6vzuN3yLXD3z35D6nV7bzNLcyrvGLf3uSKuutSLo").mpg
      .marketProducts.array[0].outright.outright.metadata.contractVolume
  ).toNumber();

  let volStats = [[vol]];

  volStats.forEach((e) => {
    client.query(
      `INSERT INTO "dexvol"(volume, time) VALUES(${e[0]}, CURRENT_TIMESTAMP);`
    );
    // console.log(`\nBTC-USD Dexterity\nVolume: $ ${e[0]}`)
  });
};

const parimutuelsVol = async () => {
  try {
    let markets = sdk.getMarketPubkeys(
      sdk.DEV_CONFIG,
      sdk.MarketPairEnum.BTCUSD
    );

    let parimutuelWeb3 = new sdk.ParimutuelWeb3(sdk.DEV_CONFIG, connection);

    let parimutuels = await parimutuelWeb3.getParimutuels(markets, 5);
    const Markets = parimutuels.filter(
      (p) =>
        p.info.parimutuel.slot.toNumber() != 0 &&
        p.info.parimutuel.activeLongPositions.toNumber() +
          p.info.parimutuel.activeShortPositions.toNumber() >
          0
    );

    const insertRecord = async (slot: number, volume: number) => {
      try {
        // First, check if the slot number already exists in the table
        const result = await client.query(
          'SELECT * FROM "parivolslots" WHERE slot = $1',
          [slot]
        );
        if (result.rowCount > 0) {
          // The slot number already exists, so we cannot insert a new record
          return;
        }
        // The slot number does not exist, so we can insert the new record
        await client.query(
          'INSERT INTO "parivolslots" (slot, volume, time) VALUES ($1, $2, CURRENT_TIMESTAMP)',
          [slot, volume]
        );
        return;
      } catch (err) {
        // An error occurred, so we return false
        return false;
      }
    };
    
    const insertions = Markets.map(async (e) => {
      let long = e.info.parimutuel.activeLongPositions.toNumber() / usdcDec;
      let short = e.info.parimutuel.activeShortPositions.toNumber() / usdcDec;
      let volume = long + short;
      let slot = e.info.parimutuel.slot.toNumber();
    
      return insertRecord(slot, volume);
    });
    
    await Promise.all(insertions);

  } catch (error) {
    console.error(error);
  }
};


client.end;

// it will get and insert parimutues data into the DB Table every 1 min
parimutuelsVol().then(() => setInterval(() => parimutuelsVol(), 60000));

// it will get and insert dexterity data into the DB Table every 1 hour
dexterityVol().then(() => setInterval(() => dexterityVol(), 3600000));
