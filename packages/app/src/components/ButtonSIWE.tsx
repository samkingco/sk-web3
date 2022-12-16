import { useSIWE } from "connectkit";
import { useState } from "react";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { useIsMounted } from "../hooks/useIsMounted";
import { siweConfig } from "../providers/Web3Provider";
import { trpc } from "../utils/trpc";
import { Button } from "./Button";
import { ButtonConnect } from "./ButtonConnect";

type Props = {
  authenticatedText?: string;
  notAuthenticatedText?: string;
  notConnectedText?: string;
  promptConnectFirst?: boolean;
};

export function ButtonSIWE({
  authenticatedText = "Sign out",
  notAuthenticatedText = "Sign in",
  notConnectedText = "Connect",
  promptConnectFirst = false,
}: Props) {
  const isMounted = useIsMounted();

  const trpcContext = trpc.useContext();

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const { session, signedIn, signOut, nonce: nonceQuery } = useSIWE();
  const [isSigning, setIsSigning] = useState(false);
  const isLoading = Boolean(
    isSigning || session.isLoading || nonceQuery.isLoading
  );

  const onSignIn = async () => {
    try {
      const chainId = chain?.id;
      if (!address) throw new Error("No address found");
      if (!chainId) throw new Error("No chainId found");

      const nonce = nonceQuery.data;
      if (!nonce) {
        throw new Error("Could not fetch nonce");
      }

      setIsSigning(true);

      const message = siweConfig.createMessage({
        address,
        chainId,
        nonce,
      });

      // Ask user to sign message with their wallet
      const signature = await signMessageAsync({
        message,
      });

      // Verify signature
      const verified = await siweConfig.verifyMessage({ message, signature });
      if (!verified) {
        throw new Error("Error verifying SIWE signature");
      }

      setIsSigning(false);
      await session.refetch();
    } catch (error) {
      setIsSigning(false);
      console.error(error);
    }
  };

  const onSignOut = async () => {
    await trpcContext.auth.invalidate();
    if (signOut) {
      await signOut();
    }
  };

  if (!isMounted) {
    return (
      <Button key="loading" isLoading>
        {notAuthenticatedText}
      </Button>
    );
  }

  if (signedIn) {
    return <Button onClick={onSignOut}>{authenticatedText}</Button>;
  }

  if (!address && promptConnectFirst) {
    return <ButtonConnect notConnectedText={notConnectedText} />;
  }

  return (
    <Button onClick={onSignIn} disabled={!address} isLoading={isLoading}>
      {notAuthenticatedText}
    </Button>
  );
}
