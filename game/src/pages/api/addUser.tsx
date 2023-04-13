//import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const addUser =  (req: NextApiRequest, res: NextApiResponse) => {
  res.json(req.body);

  /*const { firstName } = req.body;
  const user = await prisma.paUsers.create({
    data: {
      nick: firstName,
    },
  });
  res.json(user);*/
  
};

export default addUser;
