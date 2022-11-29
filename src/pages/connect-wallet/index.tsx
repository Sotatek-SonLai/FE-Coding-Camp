import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useUserApi from "../../service/useUserApi";

const ConnectWalletPage = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { updateWalletAddress } = useUserApi();
  const { signMessage } = useWallet();

  const verifyWalletAddress = async (publicKey: PublicKey) => {
    try {
      const base58 = publicKey.toBase58();
      console.log(base58);
      if (!base58 || !signMessage) return;
      var enc = new TextEncoder();
      const signature = await signMessage(enc.encode("solana-coding-camp"));
      const responce = await updateWalletAddress({
        message: Buffer.from(signature).toString("base64"),
        wallet_address: base58,
      });
      Cookies.set("walletAddress", base58);
      router.push("/");
    } catch (error) {
      console.log("Faild to sign message: ", error);
    }
  };

  useEffect(() => {
    if (!publicKey) return;
    verifyWalletAddress(publicKey);
  }, [publicKey]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <WalletMultiButton />
    </div>
  );
};

export default ConnectWalletPage;
