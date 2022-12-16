import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    address: string;
    chainId: number;
    user?: DefaultSession["user"];
  }
}
