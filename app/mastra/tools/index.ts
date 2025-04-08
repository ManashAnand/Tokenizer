import { createTool } from "@mastra/core/tools";

import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { z } from "zod";
 

// const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/WZGZh0l4J0d9GjkF08a-YraJSKGyvj5W", "confirmed");

export const SolBalanceTool = createTool({
  id: "Get Solana balance",
  inputSchema: z.object({
    publicKey: z.string(),
  }),
  description: `Fetches the balance of solana address using public key`,
  execute: async ({ context: { publicKey } }) => {
    console.log("Using tool to fetch sol balance for", publicKey);
    return {
      publicKey,
      currentBalance: await getSolBalance(publicKey),
    };
  },
});

export const RequestAirdrop = createTool({
  id: "Request airdrop",
  inputSchema: z.object({
    publicKey: z.string(),
    amount: z.number()
  }),
  description: `Request the airdrop on solana address on given public key and for the given amount present in context`,
  execute: async ({ context: { publicKey,amount } }) => {
    console.log(`Amount ${amount} to public address ${publicKey}`);
    return {
      publicKey,
      isSuccessfull: await requestSolDrop(publicKey,amount),
    };
  },
});

const requestSolDrop = async(publicKey:string,amount:number) => {
  try {
    await connection.requestAirdrop(
      new PublicKey(publicKey),
      amount * LAMPORTS_PER_SOL
    );
    
    return { success: true };
  } catch (error) {
    
    console.log(error)
    return { success: false}
  }
  
}

const getSolBalance = async (
  publicKey: any): Promise<any> => {
  try {
      const res = await connection.getBalance(
          new PublicKey(publicKey)
      );
      console.log(res / LAMPORTS_PER_SOL)
      return { success: true, accountBalance: res / LAMPORTS_PER_SOL };

  } catch (error) {
      console.log(error)
      return { success: false, accountBalance: 0 }
  }
}