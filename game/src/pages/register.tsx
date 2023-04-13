import { type NextPage } from "next";

import { SignIn, SignUp, useUser } from "@clerk/nextjs";

import SignOutButton from "@/components/Auth/SignOut";
import Layout from "@/components/Layout/Layout";

const Register: NextPage = () => {
  const user = useUser();

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {!user.isSignedIn && (
                <SignIn
                  path="/login"
                  routing="path"
                  signUpUrl="/login"
                  redirectUrl="/afterlogin"
                />
              )}
              {user.isSignedIn && <SignOutButton />}
              <br />
              <SignUp
                path="/register"
                routing="path"
                signInUrl="/register"
                redirectUrl="/addUser"
              />
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Register;
