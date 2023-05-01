import { FC, useState } from "react";
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

const Military: FC<IMilitaryProps> = ({ paPlayer }) => {
  const [attack, setAttack] = useState("");
  const [defend, setDefend] = useState("");

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // handle form submission here
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-lg">
        <div className="bg-white shadow-md rounded-lg px-8 py-6 mb-4">
          <p className="text-sm">
            Launch attack{' '}
            <span className="text-xs">
              (ETA 30, will attack for 5 ticks. ETA 25 if defender's continent is declared war upon by your Underling of War.)
            </span>
            :
          </p>
          <form onSubmit={handleSubmit} className="flex flex-wrap justify-between items-center mb-4">
            <div className="w-1/2 mr-2">
              <span className="text-xs">Country ID #:</span>
              <br />
              <a href="#">
                Find
              </a>
            </div>
            <div className="w-1/2">
              <input type="text" name="attack" value={attack} onChange={(e) => setAttack(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3" />
            </div>
            <input type="submit" value="Attack" className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
          </form>
          <p className="text-sm">
            Defend{' '}
            <span className="text-xs">
              (ETA 20, will defend for 10 ticks. When in same continent, ETA is 15)
            </span>
            :
          </p>
          <form onSubmit={handleSubmit} className="flex flex-wrap justify-between items-center">
            <div className="w-1/2 mr-2">
              <span className="text-xs">Country ID #:</span>
              <br />
              <a href="#">
                Find
              </a>
            </div>
            <div className="w-1/2">
              <input type="text" name="defend" value={defend} onChange={(e) => setDefend(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3" />
            </div>
            <input type="submit" value="Defend" className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Military;
