import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "antd";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React from "react";
import useUserApi from "../../service/useUserApi";

const ConnectWalletPage = () => {
  const router = useRouter();
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
    const provider = getProvider();
    const resp = await provider.request({ method: "connect" });
    const publicKey = resp.publicKey.toBase58();
    if (!publicKey || !signMessage) return;

    var enc = new TextEncoder();
    const signature = await signMessage(enc.encode("solana-coding-camp"));
    const responce = await updateWalletAddress({
      message: Buffer.from(signature).toString("base64"),
      wallet_address: publicKey,
    });

    Cookies.set("walletAddress", publicKey);
    router.push("/dashboard");
    console.log("responce: ", responce);
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
