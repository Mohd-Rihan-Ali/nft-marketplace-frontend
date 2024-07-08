import styles from "../styles/Navbar.module.scss";
import { IoIosSearch } from "react-icons/io";
import { PiHandbagSimpleLight } from "react-icons/pi";
import { useMinter } from "../utils/contexts/MinterContext";
import { useMarketplace } from "../utils/contexts/MarketplaceContext";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { connectWallet, account } = useMinter();
  const { connectWallet: marketplaceWallet } = useMarketplace();
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectWallet = () => {
    connectWallet();
    marketplaceWallet();

    setIsConnected(true);
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.left}>
            <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
              <div className={styles.logo}>Minter</div>
            </Link>
            <div className={styles.menu}>
              <Link
                to={"/mint"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className={styles.menu_item}>Mint</div>
              </Link>
              <Link
                to={"/profile"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className={styles.menu_item}>Profile</div>
              </Link>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.right_container}>
              <div className={styles.search}>
                <div className={styles.search_container}>
                  <div className={styles.search_icon}>
                    <IoIosSearch size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search"
                    className={styles.search_input}
                  />
                </div>
              </div>
              <div
                className={styles.connect_wallet}
                onClick={handleConnectWallet}
              >
                {isConnected ? account : "Connect Wallet"}
              </div>
              <div className={styles.bag_icon}>
                <PiHandbagSimpleLight size={25} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
