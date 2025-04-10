import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { Transaction, Connection } from '@solana/web3.js';

export async function handleMessageSigning(wallet: any, message: string, append: Function) {
  console.log("Starting signing");
  if (!wallet?.signMessage) {
    console.error("Wallet does not support signMessage");
    return;
  }

  try {
    const encoded = new TextEncoder().encode(message);
    const signature = await wallet.signMessage(encoded);
    const base64Sig = Buffer.from(signature).toString("base64");

    append({
      id: Math.random().toString(),
      role: 'assistant',
      content: 'Your message has been signed.\n' + base64Sig,
    });
  } catch (err) {
    console.error("User declined to sign:", err);
    append({
      id: Math.random().toString(),
      role: 'assistant',
      content: 'Not able to sign the message.',
    });
  }
}

export async function handleTransactionSigning(wallet: any, message: string, connection: Connection, append: Function) {
  const txMatch = message.match(/([A-Za-z0-9+/=]{100,})/);
  const base64Tx = txMatch?.[1];
  if (!base64Tx) return;

  try {
    if (!wallet) throw new WalletNotConnectedError();

    const txBuffer = Buffer.from(base64Tx, 'base64');
    const transaction = Transaction.from(txBuffer);

    try {
      const signedTx = await wallet.signTransaction(transaction);
      const rawTx = signedTx.serialize();
      const signature = await connection.sendRawTransaction(rawTx);
      await connection.confirmTransaction(signature, 'confirmed');

      console.log('✅ Transaction confirmed:', signature);
      append({
        id: Math.random().toString(),
        role: 'assistant',
        content: 'Your transaction is confirmed.',
      });
    } catch (error) {
      append({
        id: Math.random().toString(),
        role: 'assistant',
        content: 'Rejected the request by the user with error: ' + error,
      });
    }
  } catch (e) {
    console.error('❌ Transaction failed:', e);
    append({
      id: Math.random().toString(),
      role: 'assistant',
      content: 'Transaction failed due to some technical error. No token will be deducted.',
    });
  }
}