import { useClerk } from "@clerk/clerk-react";

const SignOutButton = () => {
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    await signOut();
  };
  return <button onClick={() => handleSignOut}>Sign out</button>;
};
export default SignOutButton;
