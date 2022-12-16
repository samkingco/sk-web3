import styled from "@emotion/styled";
import Link from "next/link";
import { ButtonConnect } from "./ButtonConnect";
import { ButtonSIWE } from "./ButtonSIWE";
import { Mono, Title } from "./Typography";

const Wrapper = styled.div`
  padding: 2em;
  margin: 0 auto;
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2em;
  margin-bottom: 3em;

  @media (min-width: 40rem) {
    grid-template-columns: 1fr max-content max-content;
    align-items: center;
  }
`;

const Footer = styled.footer`
  display: flex;
  gap: 1em;
  margin-top: 3em;
`;

type Props = {
  children: React.ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <Wrapper>
      <Main>
        <Header>
          <Title>
            <Link href="/">Example NFT</Link>
          </Title>
          <ButtonConnect />
          <ButtonSIWE />
        </Header>

        {children}
      </Main>

      <Footer>
        <Mono subdued>
          <Link href="/contract">Contract</Link>
        </Mono>
      </Footer>
    </Wrapper>
  );
}
