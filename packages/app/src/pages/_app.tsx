import { Global } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { globalStyle } from "../components/GlobalStyle";
import SocialMeta from "../components/SocialMeta";
import { Web3Provider } from "../providers/Web3Provider";
import { trpc } from "../utils/trpc";

export const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <SocialMeta />
      <Global styles={globalStyle} />
      <Web3Provider>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </Web3Provider>
    </>
  );
}

export default trpc.withTRPC(MyApp);
