import * as web3 from "@solana/web3.js";
import dexterityTs from "@hxronetwork/dexterity-ts";
import { Wallet } from "@project-serum/anchor";
// @ts-ignore
const dexterity = dexterityTs.default;

const rpc = "https://hxro.rpcpool.com/081597d8bb90b3da7fd354257950";
const dexterityCon = "FUfpR31LmcP1VSbz5zDaM7nxnH55iBHkpwusgrnhaFjL";
const connection = new web3.Connection(
  "https://hxro.rpcpool.com/081597d8bb90b3da7fd354257950",
  "confirmed"
);
const keypair = web3.Keypair.generate();
const wallet = new Wallet(keypair);
const test = async() => {

  console.log(dexterity)

  const manifest = await dexterity.getManifest;

  console.log(manifest)
}

test()

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