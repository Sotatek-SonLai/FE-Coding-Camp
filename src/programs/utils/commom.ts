import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@project-serum/anchor";
import { clusterApiUrl, Connection } from "@solana/web3.js";

export const getProvider = (wallet: AnchorWallet | undefined): AnchorProvider | undefined => {
  if (!wallet) {
    return;
  }
  const network = WalletAdapterNetwork.Devnet;
  const connection = new Connection(clusterApiUrl(network), "confirmed");
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });
  return provider;
};
