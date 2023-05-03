import { IconContext } from "react-icons";
import { BiCopyright } from "react-icons/bi";

/**
 * Renders the footer for the application
 * @function Footer
 * @returns {JSX.Element} - Rendered Hamburger component
 */

const Footer = () => (
  <footer
    aria-label="Innholdet for bunnteksten med copyright"
    data-testid="footer"
    className="md:absolute md:top-[92vh] fixed w-full bottom-0 md:initial"
  >
    <div className="w-full bg-gray-800 shadow">
      <div className="mx-auto inline-block w-full p-6 text-center font-semibold text-white">
        Copyright killaH
        <IconContext.Provider value={{ className: "inline-block m-2" }}>
          <BiCopyright size="1.2em" />
        </IconContext.Provider>
        {new Date().getFullYear()}
      </div>
    </div>
  </footer>
);

export default Footer;
