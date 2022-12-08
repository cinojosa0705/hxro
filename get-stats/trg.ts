import * as web3 from "@solana/web3.js";

const dexterityCon = "FUfpR31LmcP1VSbz5zDaM7nxnH55iBHkpwusgrnhaFjL";
const connection = new web3.Connection(
  "https://hxro.rpcpool.com/081597d8bb90b3da7fd354257950",
  "confirmed"
);

const getTRG = async () => {
  const accounts = await connection.getParsedProgramAccounts(
    new web3.PublicKey(dexterityCon),
    {
      filters: [
        {
          dataSize: 63632, // number of bytes
        },
      ],
    },
  );
  console.log(`There are ${accounts.length} TRGs in the Dexterity contract on mainnet`)
};

getTRG()