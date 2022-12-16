import ReactMarkdown from "react-markdown";
import { Body } from "./Typography";

type Props = {
  children: string;
};

export function Markdown({ children }: Props) {
  return (
    <ReactMarkdown
      components={{
        p(props) {
          return <Body {...props} />;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
