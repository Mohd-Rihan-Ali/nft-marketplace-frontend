import { useEffect, useState } from "react";
import styles from "../styles/Form.module.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMinter } from "../utils/contexts/MinterContext";
// import dotenv from "dotenv";

// dotenv.config();

interface NFT {
  name: string;
  description: string;
  image: string;
  tokenId: number;
  createdAt: Date;
}
// const url = process.env.URL as string;
export const HomePage = () => {
  const { account } = useMinter();
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);

  const { data: nfts } = useQuery({
    queryKey: ["nfts"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8801/nfts");
      return response.data;
    },
  });

  useEffect(() => {
    setOwnedNFTs(nfts || []);
  }, [nfts, account]);

  return (
    <div className="home">
      <div className={styles.nftGallery}>
        {ownedNFTs?.map((nft) => (
          <Link
            to={`/nft/${nft.tokenId}`}
            key={nft.tokenId}
            className={styles.nftLink}
          >
            <div className={styles.nftItem}>
              <img src={nft.image} alt={nft.name} />
              <div className={styles.nftName}>{nft.name}</div>
              <div className={styles.nftDescription}>{nft.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
