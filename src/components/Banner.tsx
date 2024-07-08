import { useEffect, useState } from "react";
import styles from "../styles/Banner.module.scss";
import { images } from "../assets/index";

const Banner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={styles.banner}
      style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
    >
      <div className={styles.content}>
        <h1 className={styles.title}>Mint Portal: Minter</h1>
        <p className={styles.subtitle}>A marketplace for NFTs</p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>75 ETH</span>
            <p>Total volume</p>
          </div>
          <div className={styles.stat}>
            <span>0.0196 ETH</span>
            <p>Floor price</p>
          </div>
          <div className={styles.stat}>
            <span>0.016 WETH</span>
            <p>Best offer</p>
          </div>
          <div className={styles.stat}>
            <span>11%</span>
            <p>Listed</p>
          </div>
          <div className={styles.stat}>
            <span>2,589 (47%)</span>
            <p>Owners (Unique)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
