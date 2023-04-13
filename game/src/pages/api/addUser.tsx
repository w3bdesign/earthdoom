import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const addUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { firstName } = req.body;
  const user = await prisma.user.create({
    data: {
      nick: firstName,
    },
  });
  res.json(user);
};

export default addUser;
