import { SignedIn, useUser } from "@clerk/nextjs";




import Link from "next/link";
import Script from "next/script";

const Navbar = () => {
  const { user, isLoaded } = useUser();

  return (
  <div className="flex min-h-[110px] justify-center bg-gray-800 p-6">
    <SignedIn>
      
      User: {user?.username}

      <nav
        className="relative flex w-full items-center justify-between bg-gray-800 py-2 text-white  dark:bg-neutral-700 dark:text-neutral-300 lg:flex-wrap lg:justify-center"
        data-te-navbar-ref
      >
        <div className="px-6">
          <button
            className="border-0 text-xl leading-none transition-shadow duration-150 ease-in-out dark:hover:text-white dark:focus:text-white lg:hidden"
            type="button"
            data-te-collapse-init
            data-te-target="#navbarSupportedContentX"
            aria-controls="navbarSupportedContentX"
            aria-expanded="false"
            aria-label="Toggle navigation"
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
          <div
            className="!visible hidden flex-grow basis-[100%] items-center lg:!flex lg:basis-auto"
            id="navbarSupportedContentX"
            data-te-collapse-item
          >
            <ul className="mr-auto flex flex-row" data-te-navbar-nav-ref>
              <li className="static" data-te-nav-item-ref data-te-dropdown-ref>
                <button
                  className="flex items-center whitespace-nowrap py-2 pr-2 text-lg font-bold  transition duration-150 ease-in-out hover:text-slate-300  dark:hover:text-white dark:focus:text-white lg:px-2"
                  type="button"
                  id="dropdownMenuButtonX"
                  data-te-dropdown-toggle-ref
                  aria-expanded="false"
                  data-te-nav-link-ref
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
                  className="absolute left-0 right-0 top-full z-[1000] mt-0 hidden w-full border-none bg-white bg-clip-padding text-neutral-600  dark:bg-neutral-700 dark:text-neutral-200 [&[data-te-dropdown-show]]:block"
                  aria-labelledby="dropdownMenuButtonX"
                  data-te-dropdown-menu-ref
                >
                  <div className="px-6 py-5 lg:px-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <Link
                          href="/"
                          aria-current="true"
                          className="block w-full border-b border-neutral-200 px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-800 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          Main
                        </Link>
                        <Link
                          href="https://earthdoom.com/manual"
                          target="new"
                          aria-current="true"
                          className="block w-full border-b border-neutral-200 px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-800 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          Manual
                        </Link>
                        <Link
                          href="/news"
                          aria-current="true"
                          className="block w-full border-b border-neutral-200 px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-800 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          News
                        </Link>
                        <Link
                          href="/contnews"
                          aria-current="true"
                          className="block w-full border-b border-neutral-200 px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-800 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          Continent News
                        </Link>
                        <Link
                          href="/mail"
                          aria-current="true"
                          className="block w-full px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-50 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          Mail
                        </Link>
                      </div>
                      <div>
                        <Link
                          href="/production"
                          aria-current="true"
                          className="block w-full border-b border-neutral-200 px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-800 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          Production
                        </Link>
                        <Link
                          href="/construct"
                          aria-current="true"
                          className="block w-full border-b border-neutral-200 px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-800 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          Construct
                        </Link>
                        <Link
                          href="/research"
                          aria-current="true"
                          className="block w-full border-b border-neutral-200 px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-800 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          Research
                        </Link>
                        <Link
                          href="/energy"
                          aria-current="true"
                          className="block w-full px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-50 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          Energy
                        </Link>
                      </div>
                      <div>
                        <Link
                          href="/resources"
                          aria-current="true"
                          className="block w-full border-b border-neutral-200 px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-800 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          Resources
                        </Link>
                        <Link
                          href="/military"
                          aria-current="true"
                          className="block w-full border-b border-neutral-200 px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-800 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          Military
                        </Link>
                        <Link
                          href="/spying"
                          aria-current="true"
                          className="block w-full border-b border-neutral-200 px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-800 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          Spying
                        </Link>

                        <Link
                          href="/ranking"
                          aria-current="true"
                          className="block w-full border-b border-neutral-200 px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-800 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          Ranking
                        </Link>
                      </div>
                      <div>
                        <Link
                          href="/country"
                          aria-current="true"
                          className="block w-full border-b border-neutral-200 px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-800 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          Country
                        </Link>

                        <Link
                          href="/logout"
                          aria-current="true"
                          className="block w-full border-b border-neutral-200 px-6 py-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-800 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                        >
                          Logout
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </SignedIn>
    <Script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/tw-elements.umd.min.js"></Script>
  </div>
)}

export default Navbar;
