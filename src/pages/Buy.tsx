import React, { useState } from "react";
import { useMarketplace } from "../utils/contexts/MarketplaceContext";
import styles from "../styles/Buy.module.scss";

const Buy: React.FC = () => {
  const { buyNft, getListing } = useMarketplace();
  const [tokenId, setTokenId] = useState<number>(0);

  const handleBuyNft = () => {
    buyNft(tokenId);
  };

  const handleGetListing = () => {
    getListing(tokenId);
  };

  return (
    <div className={styles.buy}>
      <h1>Buy NFTs</h1>
      <div className={styles.form}>
        <input
          type="number"
          placeholder="Token ID"
          onChange={(e) => setTokenId(Number(e.target.value))}
          className={styles.input}
        />
        <div className={styles.buttons}>
          <button onClick={handleBuyNft} className={styles.button}>
            Buy NFT
          </button>
          <button onClick={handleGetListing} className={styles.button}>
            Get Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default Buy;
