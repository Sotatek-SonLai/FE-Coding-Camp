import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useUserApi from "../../service/useUserApi";
import {Button} from "antd"

const ConnectWalletPage = () => {
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const { updateWalletAddress } = useUserApi();
  const { signMessage } = useWallet();

  const verifyWalletAddress = async () => {
    try {
      if(!publicKey) return
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


  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="box">
        <WalletMultiButton />
        <br/><br/>
        <div className="flex justify-center">
          <Button onClick={verifyWalletAddress} type='primary'>Click to link Wallet with your account</Button>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletPage;
