import "flowbite";

import Link from "next/link";

const Navbar = () => (
  <div className="flex justify-center bg-gray-800">
    <nav>
      <button
        id="dropdownHoverButton"
        data-dropdown-toggle="dropdownHover"
        data-dropdown-trigger="click"
        className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Menu{" "}
        <svg
          className="ml-2 h-4 w-4"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      <div
        id="dropdownHover"
        className="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700"
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownHoverButton"
        >
          <li>
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Main
            </Link>
          </li>
          <li>
            <Link
              href="https://earthdoom.com/manual"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              target="new"
            >
              Manual
            </Link>
          </li>
          <li>
            <Link
              href="/news"
              className="block px-4 py-2
              hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              News
            </Link>
          </li>
          <li>
            <Link
              href="/contnews"
              className="block px-4 py-2
              hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Contnews
            </Link>
          </li>
          <li>
            <Link
              href="/communication"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Mail
            </Link>
          </li>
          <li>
            <Link
              href="/politics"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Politics
            </Link>
          </li>
          <hr />
          <li>
            <Link
              href="/production"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Production
            </Link>
          </li>
          <li>
            <Link
              href="/construct"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Construct
            </Link>
          </li>
          <li>
            <Link
              href="/research"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Research
            </Link>
          </li>
          <li>
            <Link
              href="/sats"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Satellites
            </Link>
          </li>
          <li>
            <Link
              href="/resources"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Resources
            </Link>
          </li>
          <hr />
          <li>
            <Link
              href="/military"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Military
            </Link>
          </li>
          <li>
            <Link
              href="/spying"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Spying
            </Link>
          </li>
          <li>
            <Link
              href="/ranking"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Ranking
            </Link>
          </li>
          <li>
            <Link
              href="/alliance"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Alliance
            </Link>
          </li>
          <li>
            <Link
              href="/senate"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Senate
            </Link>
          </li>
          <li>
            <Link
              href="/country"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Country
            </Link>
          </li>
          <hr />
          <li>
            <Link
              href="/endre"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Preferences
            </Link>
          </li>

          <li>
            <Link
              href="/logout"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
);

export default Navbar;
