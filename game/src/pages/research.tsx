import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import { BUILDINGS } from "@/components/features/Research/constants/RESEARCH";
import { Button, AdvancedDataTable, ToastComponent } from "@/components/ui";

/**
 * Renders the research page if the user is signed in and has a username. The page
 * displays a table of buildings with their descriptions, ETAs, and costs, and allows
 * the user to research a building by clicking a button.
 * When the button is clicked, a mutation is made to the database to start the research and a success message is
 * displayed. If there is an error, an error message is displayed.
 *
 * @return {JSX.Element} The research page component
 */
const ResearchPage: NextPage = () => {
  const ctx = api.useContext();
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) {
    return null;
  }

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  const { mutate, isLoading } = api.paUsers.researchBuilding.useMutation({
    onSuccess: async () => {
      ToastComponent({
        message: "Research started",
        type: "success",
      });
      await ctx.paUsers.getPlayerByNick.invalidate();
      await ctx.paUsers.getPlayerByNick.refetch();
    },
    onError: () => {
      ToastComponent({
        message: "Database error",
        type: "error",
      });
    },
  });

  const columns = [
    { label: "Name", accessor: "buildingName" },
    { label: "Description", accessor: "buildingDescription" },
    { label: "ETA", accessor: "buildingETA" },
    { label: "Cost", accessor: "buildingCost" },
    { label: "Action", accessor: <Button />, type: "button" },
  ];

  const caption = "Research";

  if (!paPlayer) return null;

  return (
    <>
      <Layout paPlayer={paPlayer}>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 md:w-[63rem]">
            <div className="relative sm:mx-auto">
              {paPlayer && (
                <AdvancedDataTable
                  isLoading={isLoading}
                  columns={columns}
                  data={[paPlayer]}
                  caption={caption}
                  renderData={BUILDINGS}
                  action={mutate}
                  actionText="Research"
                  actionInProgress="Researching ..."
                />
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ResearchPage;
