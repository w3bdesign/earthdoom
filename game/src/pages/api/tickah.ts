import { PrismaClient } from "@prisma/client";

import type { NextApiRequest, NextApiResponse } from "next";

import { apiKeyAuth } from "../../middlewares/apiKeyAuth";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    "p_infinitys_eta",
    "p_warfrigs_eta",
    "p_wraiths_eta",
    "p_astropods_eta",
    "p_destroyers_eta",
    "p_cobras_eta",
    "p_scorpions_eta",
    "p_rcannons_eta",
    "p_avengers_eta",
    "p_lstalkers_eta",
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
          gt:
            field.startsWith("c_") ||
            field.startsWith("p_") ||
            field.startsWith("r_")
              ? 1
              : 0,
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

  await prisma.paUsers.findMany({
    orderBy: { score: "desc" },
  });

  // Add income

  const users = await prisma.paUsers.findMany();

  for (const user of users) {
    const {
      id,
      civilians,
      tax,
      asteroid_crystal,
      c_crystal,
      r_imcrystal,
      c_energy,
      sats,
      asteroid_metal,
      c_metal,
      r_immetal,
      p_infinitys_eta,
      p_infinitys,
      p_warfrigs_eta,
      p_warfrigs,
      p_wraiths_eta,
      p_wraiths,
      p_astropods_eta,
      p_astropods,
      p_destroyers_eta,
      p_destroyers,
      p_cobras_eta,
      p_cobras,
      p_scorpions_eta,
      p_scorpions,
      p_rcannons_eta,
      p_rcannons,
      p_avengers_eta,
      p_avengers,
      p_lstalkers_eta,
      p_lstalkers,
    } = user;

    const sivile = Math.floor((civilians / 12) * 1.1);
    const inntekt = Math.floor((civilians * tax) / 100);
    const maksbeboere = asteroid_crystal * 300;
    const ekstra = Math.floor(inntekt * 0.1);
    const ekstra2 = Math.floor(asteroid_metal * 0.1);

    if (civilians < maksbeboere) {
      await prisma.paUsers.update({
        where: { id },
        data: { civilians: { increment: sivile } },
      });
    }

    if (c_crystal === 1 && r_imcrystal !== 1) {
      await prisma.paUsers.update({
        where: { id },
        data: { crystal: { increment: inntekt } },
      });
    }

    if (c_crystal === 1 && r_imcrystal === 1) {
      await prisma.paUsers.update({
        where: { id },
        data: { crystal: { increment: inntekt + ekstra } },
      });
    }
  }

  return res.status(200).json({ message: "Database updated" });
}

//export default apiKeyAuth(handler);

export default handler;
