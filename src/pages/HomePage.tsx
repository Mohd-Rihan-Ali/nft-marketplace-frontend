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
}

export const HomePage = () => {
  const { account } = useMinter();
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);

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
    console.log("Hello data:", nfts);
    if (nfts) setOwnedNFTs(nfts);
  }, [nfts]);

  return (
    <>
      <Banner />
      <div className={styles.home}>
        <div className={styles.nftGallery}>
          {ownedNFTs?.length > -1
            ? ownedNFTs?.map((nft) => (
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
                  </div>
                </Link>
              ))
            : "Loading..."}
        </div>
      </div>
    </>
  );
};
