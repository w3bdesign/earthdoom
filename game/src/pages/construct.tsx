import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import Construct from "@/components/features/Construct";

import { api } from "@/utils/api";
import { Button, TestDataTable, ToastComponent } from "@/components/ui/common";
import { BUILDINGS } from "@/components/features/Construct/constants/BUILDINGS";
import { canAffordToTrain } from "@/utils/functions";

const Construction: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: user.username,
  });

  if (!paPlayer) return null;

  const columns = [
    { label: "Name", accessor: "buildingName" },
    { label: "Description", accessor: "buildingDescription" },
    { label: "ETA", accessor: "buildingETA" },
    { label: "Cost", accessor: "buildingCost" },
    { label: "Action", accessor: <Button>Construct</Button> },
  ];

  const caption = "Test data table";

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center px-2 py-2 ">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <div className="relative py-4 sm:mx-auto">
              {paPlayer && <Construct paPlayer={paPlayer} />}

              {paPlayer && (
                <TestDataTable
                  columns={columns}
                  data={[paPlayer]}
                  caption={caption}
                  renderData={BUILDINGS}
                />
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Construction;
