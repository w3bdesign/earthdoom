import { NextApiRequest, NextApiResponse } from "next";

const allowedAPIKey = process.env.SECURE_TICKAH_API_KEY;

export const apiKeyAuth =
  (handler: (req: NextApiRequest, res: NextApiResponse) => void) =>
  (req: NextApiRequest, res: NextApiResponse) => {
    const apiKey = req.headers["x-tickah-api-key"];

    if (apiKey !== allowedAPIKey) {
      // TODO Re enable this in production
      // return res.status(401).json({ message: "Unauthorized" });
    }

    return handler(req, res);
  };
