import { createTool } from "@mastra/core/tools";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { z } from "zod";
import { ed25519 } from "@noble/curves/ed25519";

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
  execute: async ({ context: { publicKey, amount } }) => {
    console.log(`Amount ${amount} to public address ${publicKey}`);
    return {
      publicKey,
      isSuccessfull: await requestSolDrop(publicKey, amount),
    };
  },
});




export const sendSolana = createTool({
  id: "Send Solana Transaction",
  inputSchema: z.object({
    from: z.string(),
    to: z.string(),
    amount: z.number(),
  }),
  description: `Create a SOL transfer transaction from a given public key to a recipient. Returns a serialized transaction.`,
  execute: async ({ context: { from, to, amount } }) => {
    try {
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");

      const fromPubkey = new PublicKey(from);
      const toPubkey = new PublicKey(to);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: amount * 1e9, // SOL to lamports
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      // Return base64-encoded transaction (still unsigned)
      const serializedTx = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      return {
        tx: serializedTx.toString("base64"),
      };

    } catch (error) {
      console.log(error)
    }

  },
});

export const requestUserSignature = createTool({
  id: "RequestUserSignature",
  inputSchema: z.object({
    message: z.string(),
  }),
  description: `Return a message string that the user should sign.`,
  execute: async ({ context: { message } }) => {
    return { message };
  },
});

export const VerifySignMessage = createTool({
  id: "verify signed message",
  inputSchema: z.object({
    publicKey: z.string(),
    message: z.string(),
    signature: z.string()
  }),
  description: `Verify signed message using signature, publicKey and message with ed25519 verify`,
  execute: async ({ context: { publicKey, message, signature } }) => {
    try {
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = Buffer.from(signature, "base64");

      console.log("Signature length:", signatureBytes.length);
      if (signatureBytes.length !== 64) {
        throw new Error(`Invalid signature length: expected 64, got ${signatureBytes.length}`);
      }
  
      const publicKeyBytes = new PublicKey(publicKey).toBytes();
      console.log(messageBytes, signatureBytes, publicKeyBytes)
      const isValid = ed25519.verify(signatureBytes, messageBytes, publicKeyBytes);

      return { success: isValid };
    } catch (err) {
      console.error("Signature verification failed", err);
      return { success: false };
    }
  },
});


const requestSolDrop = async (publicKey: string, amount: number) => {
  try {
    await connection.requestAirdrop(
      new PublicKey(publicKey),
      amount * LAMPORTS_PER_SOL
    );

    return { success: true };
  } catch (error) {

    console.log(error)
    return { success: false }
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