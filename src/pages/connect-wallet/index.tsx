import { useWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletName } from "@solana/wallet-adapter-wallets";
import { Button } from "antd";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React from "react";
import useUserApi from "../../service/useUserApi";

const ConnectWalletPage = () => {
  const router = useRouter();
  const { wallet, connect, connecting, connected, publicKey, select } =
    useWallet();
  const { updateWalletAddress } = useUserApi();
  const { signMessage } = useWallet();
  const getProvider = () => {
    if ("phantom" in window) {
      const provider = window.phantom?.solana;

      if (provider?.isPhantom) {
        return provider;
      }
    }

    window.open("https://phantom.app/", "_blank");
  };

  const handleClick = async () => {
    console.log("connect wallet btn click");
    select(PhantomWalletName);
    await connect();
    if (!publicKey) return;
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
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button type="primary" onClick={handleClick}>
        Connect Wallet
      </Button>
    </div>
  );
};

export default ConnectWalletPage;
