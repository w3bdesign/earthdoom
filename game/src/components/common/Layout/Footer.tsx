/**
 * Renders the footer for the application
 * @function Footer
 * @returns {JSX.Element} - The footer
 */
const Footer = () => (
  <footer
    data-testid="footer"
    className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 text-xs text-muted md:px-8 md:pb-8"
  >
    © {new Date().getFullYear()} killaH · Earth Doom
  </footer>
);

export default Footer;
