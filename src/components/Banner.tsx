import { useEffect, useState } from "react";
import styles from "../styles/Banner.module.scss";
import { images } from "../assets/index";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Banner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const { data: nftStats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_URL as string}/stats`
      );
      return response.data;
    },
  });

  const _bestOffer = nftStats?.bestOffer / 10 ** 18;
  const _totalPrice = (nftStats?.totalPrice / 10 ** 18).toFixed(3);
  const _percetnListed = nftStats?.percentListed?.toFixed(2);

  return (
    <div
      className={styles.banner}
      style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mint Portal: Minter</h1>
          <p className={styles.subtitle}>A marketplace for NFTs</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>{_totalPrice} ETH</span>
            <p>Total volume</p>
          </div>
          <div className={styles.stat}>
            <span>{_bestOffer} ETH</span>
            <p>Best offer</p>
          </div>
          <div className={styles.stat}>
            <span>{_percetnListed}%</span>
            <p>Listed</p>
          </div>
          <div className={styles.stat}>
            <span>{nftStats?.totalUsers}</span>
            <p>Owners (Unique)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
