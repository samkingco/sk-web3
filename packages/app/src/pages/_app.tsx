import { Global } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps, AppType } from "next/app";
import { globalStyle } from "../components/GlobalStyle";
import SocialMeta from "../components/SocialMeta";
import { Web3Provider } from "../providers/Web3Provider";
import { trpc } from "../utils/trpc";

export const queryClient = new QueryClient();

const App: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{
  session?: Session | null;
}>) => {
  return (
    <SessionProvider session={session}>
      <SocialMeta />
      <Global styles={globalStyle} />
      <Web3Provider>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </Web3Provider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
