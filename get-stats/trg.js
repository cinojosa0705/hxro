"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3 = __importStar(require("@solana/web3.js"));
const dexterity_ts_1 = __importDefault(require("@hxronetwork/dexterity-ts"));
const anchor_1 = require("@project-serum/anchor");
// @ts-ignore
const dexterity = dexterity_ts_1.default.default;
const rpc = "https://hxro.rpcpool.com/081597d8bb90b3da7fd354257950";
const dexterityCon = "FUfpR31LmcP1VSbz5zDaM7nxnH55iBHkpwusgrnhaFjL";
const connection = new web3.Connection("https://hxro.rpcpool.com/081597d8bb90b3da7fd354257950", "confirmed");
const keypair = web3.Keypair.generate();
const wallet = new anchor_1.Wallet(keypair);
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(dexterity);
    const manifest = yield dexterity.getManifest;
    console.log(manifest);
});
test();
// const getTRG = async (): Promise<[number, any[]]> => {
//   // @ts-ignore
//   const trgs = await connection.getParsedProgramAccounts(
//     new web3.PublicKey(dexterityCon),
//     {
//       filters: [
//         {
//           dataSize: 63632, // number of bytes
//         },
//       ],
//     }
//   );
//   const trgArr: any[] = []
//   trgs.forEach(async(trg) => {
//     // @ts-ignore
//     const trueTRG = await manifest.GetTRGFromData(trg.account.data)
//     trgArr.push(trueTRG.owner)
//   });
//   return [trgs.length, trgArr];
// };
// const test = async () => {
//   const trgData = await getTRG()
//   console.log(
//     `Here is how many TRGs there are: ${trgData[0]}\nHere are the account owners of each: ${trgData[1]}`
//   );
// };
// test()
