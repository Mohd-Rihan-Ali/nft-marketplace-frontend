import { useEffect, useState } from "react";
import { useMinter } from "../utils/contexts/MinterContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../styles/Profile.module.scss";

interface NFT {
  name: string;
  description: string;
  image: string;
  tokenId: number;
  createdAt: Date;
}

const Profile = () => {
  const { account } = useMinter();
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [isAccount, setIsAccount] = useState<boolean>(false);

  const { data: nfts } = useQuery<NFT[]>({
    queryKey: ["nfts", account],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:8801/nfts/${account}`);
      return response.data;
    },
    enabled: !!account,
  });

  useEffect(() => {
    setOwnedNFTs(nfts || []);
  }, [nfts, account]);

  return (
    <div className={styles.profile}>
      <h2>Your Profile</h2>

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

export default Profile;
