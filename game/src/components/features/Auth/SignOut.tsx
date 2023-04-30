import { useClerk } from "@clerk/clerk-react";

import Button from "@/components/ui/common/Button";

const SignOutButton = () => {
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    await signOut();
  };
  return <Button onClick={() => handleSignOut}>Sign out</Button>;
};
export default SignOutButton;
