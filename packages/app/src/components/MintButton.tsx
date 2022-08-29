import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useEtherscan } from "../hooks/useEtherscan";
import { useIsMounted } from "../hooks/useIsMounted";
import { exampleNFT } from "../utils/contracts";
import { Button } from "./Button";
import { LoadingIndicator } from "./LoadingIndicator";
import { Body } from "./Typography";

export function MintButton() {
  const isMounted = useIsMounted();
  const { data: price } = useContractRead({
    ...exampleNFT,
    functionName: "PRICE",
  });

  // Prepare the mint transaction
  const { config, error } = usePrepareContractWrite({
    ...exampleNFT,
    functionName: "mint",
    overrides: {
      value: price,
    },
    enabled: Boolean(price),
  });

  if (error) {
    console.error(error);
  }

  // Send the transaction
  const {
    write,
    data: txData,
    isLoading: isWaitingOnWallet,
  } = useContractWrite(config);

  // Watch the for the transaction receipt
  const { isLoading: isWaitingOnTx, isSuccess } = useWaitForTransaction({
    confirmations: 1,
    hash: txData?.hash,
  });

  // Get the block explorer URL
  const { getTransactionUrl } = useEtherscan();
  const transactionLink = txData && getTransactionUrl(txData.hash);

  if (!isMounted) return null;

  return (
    <>
      <Button disabled={Boolean(!write || error)} onClick={() => write?.()}>
        Mint a token
      </Button>

      {isWaitingOnWallet && (
        <Body>
          <LoadingIndicator /> Check wallet
        </Body>
      )}

      {isWaitingOnTx && (
        <Body>
          <LoadingIndicator /> Transaction sent.{" "}
          {transactionLink && <a href={transactionLink}>View on explorer</a>}
        </Body>
      )}

      {isSuccess && (
        <Body>
          Transaction sent successfully{" "}
          {transactionLink && <a href={transactionLink}>View on explorer</a>}
        </Body>
      )}
    </>
  );
}
