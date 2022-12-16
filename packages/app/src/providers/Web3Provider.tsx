import { ConnectKitProvider, SIWEProvider } from "connectkit";
import { SIWEConfig } from "connectkit/build/components/Standard/SIWE/SIWEContext";
import { getCsrfToken, getSession, signIn, signOut } from "next-auth/react";
import { SiweMessage } from "siwe";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ALCHEMY_API_KEY, APP_NAME } from "../utils/constants";
import { targetChainId } from "../utils/contracts";

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli].filter((c) => c.id === targetChainId),
  [
    ...(ALCHEMY_API_KEY ? [alchemyProvider({ apiKey: ALCHEMY_API_KEY })] : []),
    publicProvider(),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: APP_NAME,
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

export const siweConfig: SIWEConfig = {
  createMessage: ({ address, chainId, nonce }) => {
    return new SiweMessage({
      version: "1",
      domain: window.location.host,
      uri: window.location.origin,
      address,
      chainId,
      nonce,
      statement: "Sign in with Ethereum.",
    }).prepareMessage();
  },
  getSession: async () => {
    const session = await getSession();
    if (!session) return null;
    return session;
  },
  getNonce: async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error();
    return nonce;
  },
  signOut: async () => {
    try {
      await signOut({ redirect: false });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  verifyMessage: async ({ message, signature }) => {
    const response = await signIn("credentials", {
      message: JSON.stringify(message),
      redirect: false,
      signature,
    });
    return response?.ok ?? false;
  },
};

type Props = {
  children: React.ReactNode;
};

export function Web3Provider({ children }: Props) {
  return (
    <WagmiConfig client={client}>
      <SIWEProvider
        {...siweConfig}
        enabled={false}
        signOutOnNetworkChange={false}
        signOutOnDisconnect
      >
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </SIWEProvider>
    </WagmiConfig>
  );
}
