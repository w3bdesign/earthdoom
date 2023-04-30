import type { FC } from "react";
import type { PaUsers } from "@prisma/client";

export interface PaPlayer extends PaUsers {
  [key: string]: number | string;
}

export interface ConstructProps {
  paPlayer: PaPlayer;
}

interface IMilitaryProps {
  paPlayer: PaPlayer;
}

const Military: FC<IMilitaryProps> = ({ paPlayer }) => (
  <div className="w-full bg-gray-800 shadow">
    <div className="mx-auto inline-block w-full p-6 text-center font-semibold text-white">
      Military
    </div>
  </div>
);

export default Military;
