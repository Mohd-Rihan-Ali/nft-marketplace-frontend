import { useEffect, useState } from "react";
import styles from "../styles/HomePage.module.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMinter } from "../utils/contexts/MinterContext";
import Banner from "../components/Banner";

interface NFT {
  name: string;
  description: string;
  image: string;
  tokenId: number;
  createdAt: Date;
  isListed: boolean;
  history: [];
}

export const HomePage = () => {
  const { account } = useMinter();
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const { data: nfts } = useQuery<NFT[]>({
    queryKey: ["nfts"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_URL as string}/nfts`
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (nfts) setOwnedNFTs(nfts);
  }, [nfts]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const filteredNFTs = ownedNFTs.filter((nft) =>
    filter === "all" ? true : filter === "listed" ? nft.isListed : !nft.isListed
  );

  return (
    <>
      <Banner />
      <div className={styles.home}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h3>Collections</h3>
            <select
              value={filter}
              onChange={handleFilterChange}
              className={styles.filterSelect}
            >
              <option value="all">All</option>
              <option value="listed">Listed</option>
              <option value="notListed">Not Listed</option>
            </select>
          </div>
          <div className={styles.nftGallery}>
            {filteredNFTs.length > 0
              ? filteredNFTs.map((nft) => (
                  <Link
                    to={`/nft/${nft.tokenId}`}
                    key={nft.tokenId}
                    className={styles.nftLink}
                  >
                    <div className={styles.nftItem}>
                      <img src={nft.image} alt={nft.name} />
                      <div className={styles.nftName}>{nft.name}</div>
                      <div className={styles.nftDescription}>
                        {nft.description}
                      </div>

                      <div className={styles.options}>
                        {nft.history[nft.history.length - 1] === account
                          ? nft.isListed
                            ? "Cancel Listing"
                            : "List"
                          : nft.isListed
                          ? "Buy"
                          : "Not Listed Yet"}
                      </div>
                    </div>
                  </Link>
                ))
              : "Loading..."}
          </div>
        </div>
      </div>
    </>
  );
};
