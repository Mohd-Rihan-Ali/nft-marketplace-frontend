import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useMinter } from "../utils/contexts/MinterContext";
import { useMarketplace } from "../utils/contexts/MarketplaceContext";
import styles from "../styles/Navbar.module.scss";

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
    return address ? `${address.slice(0, 3)}...${address.slice(-5)}` : "";
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logoLink}>
          <div className={styles.logo}>
            {/* <img src={Minter} alt="" /> */}
            Minter
          </div>
        </Link>

        <div className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
          <div className={styles.left}>
            <Link to="/mint" className={styles.menuItem}>
              Mint
            </Link>
            <Link to="/profile" className={styles.menuItem}>
              {account ? "Profile" : "Profile"}
            </Link>
            <Link to="/about" className={styles.menuItem}>
              About
            </Link>
          </div>
          <div className={styles.right}>
            {/* <div className={styles.search}>
              <IoIosSearch size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
              />
            </div> */}
            <div className={styles.connectWallet} onClick={handleConnectWallet}>
              {isConnected
                ? abbreviateAddress(account as string)
                : "Connect Wallet"}
            </div>
          </div>
        </div>
        <div className={styles.hamburger} onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
