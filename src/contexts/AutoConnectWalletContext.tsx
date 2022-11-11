import { useLocalStorage } from "@solana/wallet-adapter-react";
import { createContext, FC, ReactNode, useContext } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { endpoint, network, wallets } from "../constants";

export interface AutoConnectContextState {
  autoConnect: boolean;
  setAutoConnect(autoConnect: boolean): void;
}

const WalletContext: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const AutoConnectContext = createContext<AutoConnectContextState>(
  {} as AutoConnectContextState
);

export function useAutoConnect(): AutoConnectContextState {
  return useContext(AutoConnectContext);
}

const AutoConnectWalletProvider: FC<{ children: ReactNode }> = ({
  children,
}: any) => {
  if (typeof window !== "undefined") {
    // browser code
    window.Buffer = window.Buffer || require("buffer").Buffer;
    console.log({window})
  }
  const [autoConnect, setAutoConnect] = useLocalStorage("autoConnect", true);

  return (
    <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>
      <WalletContext>{children}</WalletContext>
    </AutoConnectContext.Provider>
  );
};

export default AutoConnectWalletProvider;
