import { ConnectKitProvider } from "connectkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { targetChainId } from "../utils/contracts";

// TODO: Replace with the project name, will show when connecting a wallet
const appName = "SK web3";

// Get the alchemy API key to set up a provider
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli].filter((c) => c.id === targetChainId),
  [
    ...(alchemyApiKey ? [alchemyProvider({ apiKey: alchemyApiKey })] : []),
    publicProvider(),
  ]
);

export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName,
        headlessMode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: false,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

interface Props {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Props) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiConfig>
  );
}