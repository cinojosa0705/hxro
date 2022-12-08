"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
//node --loader ts-node/esm ./dex.ts
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@project-serum/anchor");
const dexterity_ts_1 = __importDefault(require("@hxronetwork/dexterity-ts"));
// @ts-ignore
const dexterity = dexterity_ts_1.default;
// it has to look like this 'const dexterity = dexterity_ts_1.default;' or it won't work lol
const sdk = __importStar(require("@hxronetwork/parimutuelsdk"));
const pg_1 = require("pg");
const client = new pg_1.Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "ModerkDB",
  database: "Sales_DB",
});
client.connect();
const rpc = "https://hxro.rpcpool.com/081597d8bb90b3da7fd354257950";
const keypair = web3_js_1.Keypair.generate();
const wallet = new anchor_1.Wallet(keypair);
const connection = new web3_js_1.Connection(
  (0, web3_js_1.clusterApiUrl)("devnet"),
  "confirmed"
);
const usdcDec = 1000000;
const dexterityVol = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const manifest = yield dexterity.getManifest(rpc, false, wallet);
    let vol = yield dexterity.Fractional.From(
      manifest.fields.mpgs.get("HiCy6vzuN3yLXD3z35D6nV7bzNLcyrvGLf3uSKuutSLo")
        .mpg.marketProducts.array[0].outright.outright.metadata.contractVolume
    ).toNumber();
    let volStats = [[vol]];
    volStats.forEach((e) => {
      client.query(
        `INSERT INTO "dexvol"(volume, time) VALUES(${e[0]}, CURRENT_TIMESTAMP);`
      );
      // console.log(`\nBTC-USD Dexterity\nVolume: $ ${e[0]}`)
    });
  });
const parimutuelsVol = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      let markets = sdk.getMarketPubkeys(
        sdk.DEV_CONFIG,
        sdk.MarketPairEnum.BTCUSD
      );
      let parimutuelWeb3 = new sdk.ParimutuelWeb3(sdk.DEV_CONFIG, connection);
      let parimutuels = yield parimutuelWeb3.getParimutuels(markets, 5);
      const Markets = parimutuels.filter(
        (p) =>
          p.info.parimutuel.slot.toNumber() != 0 &&
          p.info.parimutuel.activeLongPositions.toNumber() +
            p.info.parimutuel.activeShortPositions.toNumber() >
            0
      );
      const insertRecord = (slot, volume) =>
        __awaiter(void 0, void 0, void 0, function* () {
          try {
            // First, check if the slot number already exists in the table
            const result = yield client.query(
              'SELECT * FROM "parivolslots" WHERE slot = $1',
              [slot]
            );
            if (result.rowCount > 0) {
              // The slot number already exists, so we cannot insert a new record
              return;
            }
            // The slot number does not exist, so we can insert the new record
            yield client.query(
              'INSERT INTO "parivolslots" (slot, volume, time) VALUES ($1, $2, CURRENT_TIMESTAMP)',
              [slot, volume]
            );
            return;
          } catch (err) {
            // An error occurred, so we return false
            return false;
          }
        });
      const insertions = Markets.map((e) =>
        __awaiter(void 0, void 0, void 0, function* () {
          let long = e.info.parimutuel.activeLongPositions.toNumber() / usdcDec;
          let short =
            e.info.parimutuel.activeShortPositions.toNumber() / usdcDec;
          let volume = long + short;
          let slot = e.info.parimutuel.slot.toNumber();
          return insertRecord(slot, volume);
        })
      );
      yield Promise.all(insertions);
    } catch (error) {
      console.error(error);
    }
  });
client.end;
// it will get and insert parimutues data into the DB Table every 1 min
parimutuelsVol().then(() => setInterval(() => parimutuelsVol(), 60000));
// it will get and insert dexterity data into the DB Table every 1 hour
dexterityVol().then(() => setInterval(() => dexterityVol(), 3600000));
