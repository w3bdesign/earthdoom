import { FC, useState } from "react";
import type { PaUsers } from "@prisma/client";
import Button from "@/components/ui/common/Button";

export interface PaPlayer extends PaUsers {
  [key: string]: number | string;
}

export interface ConstructProps {
  paPlayer: PaPlayer;
}

interface IMilitaryProps {
  paPlayer: PaPlayer;
}

const Military: FC<IMilitaryProps> = ({ paPlayer }) => {
  const [attack, setAttack] = useState("");
  const [defend, setDefend] = useState("");

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // handle form submission here
  };

  return (
    <div className="mt-6 flex flex-col items-center justify-center py-4">
      <div className="w-full max-w-lg">
        <div className="mb-4 rounded-lg bg-white px-8 py-6 shadow-md">
          <h2 className="py-4 text-center text-xl font-bold">Attack:</h2>
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col items-center justify-center"
          >
            <span className="text-md mb-2">Country ID #:</span>
            <input
              type="text"
              name="attack"
              value={attack}
              onChange={(e) => setAttack(e.target.value)}
              className="w-64 rounded-md border border-gray-300 px-3 py-2"
            />
            <Button extraClasses="w-32 mt-4">Attack</Button>
          </form>
          <h2 className="py-4 text-center text-xl font-bold">Defend:</h2>
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col items-center justify-center"
          >
            <span className="text-md mb-2">Country ID #:</span>
            <input
              type="text"
              name="defend"
              value={defend}
              onChange={(e) => setDefend(e.target.value)}
              className="w-64 rounded-md border border-gray-300 px-3 py-2"
            />
            <Button extraClasses="w-32 mt-4">Defend</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Military;
