import "flowbite";

const Navbar = () => (
  <div className="flex justify-center bg-gray-800">
    <nav >
      <button
        id="dropdownHoverButton"
        data-dropdown-toggle="dropdownHover"
        data-dropdown-trigger="hover"
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
            <a
              href="index2.php"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              target="a2"
            >
              Main
            </a>
          </li>
          <li>
            <a
              href="edmanual/manual.html"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              target="new"
            >
              Manual
            </a>
          </li>
          <li>
            <a
              href="news.php?"
              className="block px-4 py-2
              hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              News
            </a>
          </li>
          <li>
            <a
              href="contnews.php?"
              className="block px-4 py-2
              hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Contnews
            </a>
          </li>
          <li>
            <a
              href="communication.php?"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Mail
            </a>
          </li>
          <li>
            <a
              href="politics.php?"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Politics
            </a>
          </li>
          <hr />
          <li>
            <a
              href="production.php?"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Production
            </a>
          </li>
          <li>
            <a
              href="construct.php?"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Construct
            </a>
          </li>
          <li>
            <a
              href="research.php?"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Research
            </a>
          </li>
          <li>
            <a
              href="sats.php?"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Satellites
            </a>
          </li>
          <li>
            <a
              href="resources.php"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Resources
            </a>
          </li>
          <hr />
          <li>
            <a
              href="military.php?"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Military
            </a>
          </li>
          <li>
            <a
              href="spying.php?"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Spying
            </a>
          </li>
          <li>
            <a
              href="ranking.php?"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Ranking
            </a>
          </li>
          <li>
            <a
              href="alliance.php?"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Alliance
            </a>
          </li>
          <li>
            <a
              href="senate.php?"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Senate
            </a>
          </li>
          <li>
            <a
              href="country.php?"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Country
            </a>
          </li>
          <hr />
          <li>
            <a
              href="endre.php?"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Preferences
            </a>
          </li>

          <li>
            <a
              href="logout.php?"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
);

export default Navbar;
