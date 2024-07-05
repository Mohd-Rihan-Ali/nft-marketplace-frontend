import React, { useState } from "react";
import { useMarketplace } from "../utils/contexts/MarketplaceContext";
import styles from "../styles/Seller.module.scss";

const Seller: React.FC = () => {
  const { listNft, cancelListing, updatePrice, getListing } = useMarketplace();
  const [tokenId, setTokenId] = useState<number>();
  const [price, setPrice] = useState<number>();

  const handleListNft = () => {
    if (tokenId === undefined || price === undefined) {
      alert("Please enter a token ID and price");
      return;
    }
    listNft(tokenId, price);
  };

  const handleCancelListing = () => {
    if (tokenId === undefined) {
      alert("Please enter a token ID");
      return;
    }
    cancelListing(tokenId);
  };

  const handleUpdatePrice = () => {
    if (tokenId === undefined || price === undefined) {
      alert("Please enter a token ID and price");
      return;
    }
    updatePrice(tokenId, price);
  };

  const handleGetListing = () => {
    if (tokenId === undefined) {
      alert("Please enter a token ID");
      return;
    }
    getListing(tokenId);
  };

  return (
    <div className={styles.seller}>
      <h1>Sell Your NFTs</h1>
      <div className={styles.form}>
        <input
          type="number"
          placeholder="Token ID"
          onChange={(e) => setTokenId(Number(e.target.value))}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Price"
          onChange={(e) => setPrice(Number(e.target.value))}
          className={styles.input}
        />
        <div className={styles.buttons}>
          <button onClick={handleListNft} className={styles.button}>
            List NFT
          </button>
          <button onClick={handleCancelListing} className={styles.button}>
            Cancel Listing
          </button>
          <button onClick={handleUpdatePrice} className={styles.button}>
            Update Price
          </button>
        </div>
      </div>

      <div>
        <button onClick={handleGetListing}>Get listing</button>
      </div>
    </div>
  );
};

export default Seller;
