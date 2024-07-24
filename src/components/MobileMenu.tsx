import {
  FaBars,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaTimes,
  FaTwitter,
} from "react-icons/fa";
import styles from "../styles/MobileMenu.module.scss";
import { Link } from "react-router-dom";

const MobileMenu = (props: any) => {
  return (
    <div className={styles.container}>
      <div className={styles.cross}>
        <FaTimes size={25} className={styles.icon} onClick={props.toggleMenu} />
      </div>
      <div className={styles.menu}>
        <Link to="/mint" className={styles.menuItem} onClick={props.toggleMenu}>
          Mint
        </Link>
        <Link
          to="/profile"
          className={styles.menuItem}
          onClick={props.toggleMenu}
        >
          Profile
        </Link>
        <Link
          to="/about"
          className={styles.menuItem}
          onClick={props.toggleMenu}
        >
          About
        </Link>
      </div>

      <div className={styles.connectWallet} onClick={props.handleConnectWallet}>
        {props.isConnected
          ? props.abbreviateAddress(props.account as string)
          : "Connect Wallet"}
      </div>

      <div className={styles.socialLinks}>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          <FaTwitter onClick={props.toggleMenu} />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          <FaFacebookF onClick={props.toggleMenu} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          <FaInstagram onClick={props.toggleMenu} />
        </a>
        <a
          href="https://www.linkedin.com/in/mohd-rihan-ali/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          <FaLinkedin onClick={props.toggleMenu} />
        </a>
      </div>
    </div>
  );
};

export default MobileMenu;
