import type { NextApiRequest, NextApiResponse } from "next";

type Handler = (req: NextApiRequest, res: NextApiResponse) => any | Promise<any>;

export default function allowCors(handler: Handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      req.headers.origin,
    ].filter(Boolean);

    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    }

    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    return handler(req, res);
  };
}
