import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useMinter } from "../utils/contexts/MinterContext";
import { useMarketplace } from "../utils/contexts/MarketplaceContext";
import styles from "../styles/Navbar.module.scss";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const { connectWallet, account } = useMinter();
  const { connectWallet: marketplaceWallet } = useMarketplace();
  const [isConnected, setIsConnected] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleConnectWallet = () => {
    connectWallet();
    marketplaceWallet();
    setIsConnected(true);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const abbreviateAddress = (address: string) => {
    return address ? `${address.slice(0, 3)}...${address.slice(-3)}` : "";
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logoDiv}>
            <Link to="/" className={styles.logoLink}>
              <div className={styles.logo}>Minter</div>
            </Link>
          </div>

          <div className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
            {menuOpen ? (
              <MobileMenu
                toggleMenu={toggleMenu}
                handleConnectWallet={handleConnectWallet}
                isConnected={isConnected}
                abbreviateAddress={abbreviateAddress}
                account={account}
              />
            ) : (
              <>
                <div className={styles.left}>
                  <Link to="/mint" className={styles.menuItem}>
                    Mint
                  </Link>
                  <Link to="/profile" className={styles.menuItem}>
                    Profile
                  </Link>
                  <Link to="/about" className={styles.menuItem}>
                    About
                  </Link>
                </div>
                <div className={styles.right}>
                  <div
                    className={styles.connectWallet}
                    onClick={handleConnectWallet}
                  >
                    {isConnected
                      ? abbreviateAddress(account as string)
                      : "Connect Wallet"}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={styles.hamburger} onClick={toggleMenu}>
            {menuOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
