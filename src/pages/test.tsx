import React, { useState } from "react";

import { Breadcrumb, Layout, Menu, Button, Modal } from "antd";

const { Header, Content, Sider } = Layout;

import { getProvider } from "../programs/utils";
import CounterProgram from "../programs/CounterProgram";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const MainLayout: React.FC<any> = ({ Component, ...props }) => {
  const wallet = useAnchorWallet();
  const setupCounter = async () => {
    const provider = getProvider(wallet);
    if(!!provider) {
      const counterProgram = new CounterProgram(provider);
      counterProgram.setupCounter()
    }
  };

  const incrementCounter = async () => {
    const provider = getProvider(wallet);
    if(!!provider) {
      const counterProgram = new CounterProgram(provider);
      counterProgram.increment(50)
    }
  };

  return (
    <>
      <Button type="primary" onClick={setupCounter}>
        Setup counter
      </Button>
      <p />
      <Button type="primary" onClick={incrementCounter}>
        increment counter
      </Button>
    </>
  );
};

export default MainLayout;
