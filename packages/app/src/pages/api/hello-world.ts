import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseError } from "../../utils/fetch";

interface Data {
  message: string;
}

export default async function helloWorld(
  req: NextApiRequest,
  res: NextApiResponse<Data | ResponseError>
) {
  const shouldError = false;

  if (shouldError) {
    return res.status(400).json({
      name: "An error occurred",
      message: "Please do something to fix it",
      code: "CUSTOM_ERROR",
    });
  }

  switch (req.method) {
    case "GET":
      res.status(200).json({ message: "Hello world" });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
