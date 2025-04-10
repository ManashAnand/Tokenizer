import { createTool } from "@mastra/core/tools";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { z } from "zod";
import { ed25519 } from "@noble/curves/ed25519";
import { ExtensionType, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, getMintLen } from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";

// const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/WZGZh0l4J0d9GjkF08a-YraJSKGyvj5W", "confirmed");


export const createMintTool = createTool({
  id: "Create Mint",
  inputSchema: z.object({
    publicKey: z.string().default(""),
    decimals: z.number().default(6),
    name: z.string().default("My Solana Token"),
    symbol: z.string().default("MST"),
    uri: z.string().default("https://arweave.net/path-to-your-json-metadata")
  }),
  description: `Create a new *standard* SPL token mint on Solana (NO metadata/Token-2022).`,
  execute: async ({ context: { publicKey, decimals, name, symbol, uri } }) => {
    try {
      const mintKeypair = Keypair.generate();
      const userPublicKey = new PublicKey(publicKey);

      const metadata = {
        mint: mintKeypair.publicKey,
        name: name,
        symbol: symbol,
        uri: uri,
        additionalMetadata: [],
      };


      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

      // Calculate lamports needed for rent exemption for a standard mint
      const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

      console.log(`Standard Mint Address: ${mintKeypair.publicKey.toBase58()}`);
      console.log(`Required Lamports: ${lamports}`);

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: new PublicKey(publicKey),
            newAccountPubkey: mintKeypair.publicKey,
            space: mintLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(mintKeypair.publicKey, new PublicKey(publicKey), mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
        createInitializeMintInstruction(mintKeypair.publicKey, decimals, new PublicKey(publicKey), null, TOKEN_2022_PROGRAM_ID),
        createInitializeInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            mint: mintKeypair.publicKey,
            metadata: mintKeypair.publicKey,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            mintAuthority: new PublicKey(publicKey),
            updateAuthority: new PublicKey(publicKey),
        }),
    );

      transaction.feePayer = userPublicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      transaction.partialSign(mintKeypair); // Sign with the mint's keypair

      console.log("Standard SPL Mint Transaction constructed:", transaction);
      console.log("Partially signed by mint keypair.");

      const serializedTx = transaction.serialize({
        requireAllSignatures: false, // User's signature (fee payer) is still needed
        verifySignatures: false,
      });

      console.log(`Returning serialized standard mint transaction ${mintKeypair.publicKey.toBase58()}`);
      return {
        tx: serializedTx.toString("base64"),
        mintPubkey: mintKeypair.publicKey.toBase58(),
      };
    } catch (error) {
      console.error("Error in createMintTool (Standard SPL):", error);
      return {
        error: `Failed to create standard mint transaction: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
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