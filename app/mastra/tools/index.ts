import { createTool } from "@mastra/core/tools";

import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { z } from "zod";
 

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

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