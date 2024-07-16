import { Link } from "react-router-dom";
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import styles from "../styles/Footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Link to="/" className={styles.logoLink}>
            <div className={styles.logo}>Minter</div>
          </Link>
        </div>
        <div className={styles.navLinks}>
          <Link to="/mint" className={styles.navLink}>Mint</Link>
          <Link to="/profile" className={styles.navLink}>Profile</Link>
          <Link to="/about" className={styles.navLink}>About</Link>
        </div>
        <div className={styles.socialLinks}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <FaTwitter />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <FaFacebookF />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <FaInstagram />
          </a>
          <a href="https://www.linkedin.com/in/mohd-rihan-ali/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <FaLinkedin />
          </a>
        </div>
        <div className={styles.footerInfo}>
          <p>&copy; 2024 Minter. All rights reserved.</p>
          <p>Terms of Service | Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
