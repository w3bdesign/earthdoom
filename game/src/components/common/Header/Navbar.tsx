import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";

import { LINKS } from "./constants/LINKS";
import { useState } from "react";

const Navbar = () => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div className="flex min-h-[6.875rem] justify-center bg-gray-800 p-6">
      <SignedIn>
        <nav className="relative flex w-full items-center justify-between bg-gray-800 py-2 text-white  dark:bg-neutral-700 dark:text-neutral-300 lg:flex-wrap lg:justify-center">
          <div className="px-6">
            <button
              className="border-0 text-xl leading-none transition-shadow duration-150 ease-in-out dark:hover:text-white dark:focus:text-white lg:hidden"
              type="button"
              aria-controls="navbarSupportedContentX"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() => {
                setExpanded(!expanded);
              }}
            >
              <span className="[&>svg]:w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </span>
            </button>
            <div id="navbarSupportedContentX">
              <ul className="mr-auto flex flex-row">
                <li className="static">
                  <button
                    className="flex items-center whitespace-nowrap py-2 pr-2 text-lg font-bold  transition duration-150 ease-in-out hover:text-slate-300  dark:hover:text-white dark:focus:text-white lg:px-2"
                    type="button"
                    id="dropdownMenuButtonX"
                    aria-expanded={expanded}
                    onClick={() => {
                      setExpanded(!expanded);
                    }}
                  >
                    Main menu
                    <span className="ml-2 w-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`absolute left-0 right-0 top-full z-[1000] mt-0 w-full border-none bg-white bg-clip-padding text-neutral-600 transition-all duration-500 dark:bg-neutral-700 dark:text-neutral-200 ${
                      expanded ? "visible opacity-100" : "invisible opacity-0"
                    }`}
                    aria-labelledby="dropdownMenuButtonX"
                  >
                    <div className="px-6 py-5 lg:px-8">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {LINKS.map(({ id, href, text, target }) => (
                          <Link
                            key={id}
                            href={href}
                            target={target || "_self"}
                            className="block border-b border-neutral-200 px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-800 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                          >
                            {text}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </SignedIn>
    </div>
  );
};

export default Navbar;
