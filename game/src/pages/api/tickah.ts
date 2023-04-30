import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fieldsToUpdate = [
    "c_crystal",
    "c_metal",
    "c_airport",
    "c_abase",
    "c_destfact",
    "c_scorpfact",
    "c_odg",
    "c_energy",
    "lastsleep",
    "sleep",
    "newbie",
    "p_infinityst",
    "p_warfrigst",
    "p_wraithst",
    "p_astropodst",
    "p_destroyerst",
    "p_cobrast",
    "p_scorpionst",
    "p_rcannonst",
    "p_avengerst",
    "p_lstalkerst",
    "r_imcrystal",
    "r_immetal",
    "r_aaircraft",
    "r_tbeam",
    "r_uscan",
    "r_oscan",
    "r_odg",
    "r_energy",
  ];

  // Update fields using updateMany
  for (const field of fieldsToUpdate) {
    await prisma.paUsers.updateMany({
      where: {
        [field]: {
          gt: field.startsWith("p_") || field.startsWith("r_") ? 1 : 0,
        },
      },
      data: {
        [field]: {
          decrement: 1,
        },
      },
    });
  }

  // Handle special cases
  await prisma.paUsers.updateMany({
    where: { wareta: 0, def: { gt: 0 } },
    data: { wareta: 20, war: -1, def: 0 },
  });

  await prisma.paUsers.updateMany({
    where: { wareta: 0, war: { gt: 0 } },
    data: { wareta: 30, war: -1 },
  });

  await prisma.paUsers.updateMany({
    where: { wareta: 0, war: { lt: 0 } },
    data: { wareta: 0, war: 0 },
  });

  await prisma.paUsers.updateMany({
    where: { wareta: { gt: 0 } },
    data: { wareta: { decrement: 1 } },
  });

  const result = await prisma.paUsers.findMany({
    orderBy: { score: "desc" },
  });

  res.status(200).json({ message: "Database updated", result });
}
