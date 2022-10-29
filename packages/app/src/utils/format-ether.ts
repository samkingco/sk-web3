import { BigNumberish, ethers } from "ethers";

export function formatEther(value: BigNumberish, maxDecimals = 4) {
  const asEtherString = ethers.utils.formatEther(value);
  const formatter = new Intl.NumberFormat("en-GB", {
    maximumSignificantDigits: 4,
  });
  return formatter.format(parseFloat(asEtherString));
}
