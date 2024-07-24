import { useEffect, useState } from "react";
import { useMinter } from "../utils/contexts/MinterContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../styles/Profile.module.scss";
import ConnectWallet from "../components/ConnectWallet";

interface NFT {
  name: string;
  description: string;
  image: string;
  tokenId: number;
  createdAt: Date;
  isListed: boolean;
  history: [];
}

const Profile = () => {
  const { account } = useMinter();
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [isAccount, setIsAccount] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("all");

  const { data: nfts } = useQuery<NFT[]>({
    queryKey: ["nfts", account],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_URL as string}/nfts/${account}`
      );
      return response.data;
    },
    enabled: !!account,
  });

  useEffect(() => {
    setOwnedNFTs(nfts || []);
  }, [nfts, account]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const filteredNFTs = ownedNFTs.filter((nft) =>
    filter === "all" ? true : filter === "listed" ? nft.isListed : !nft.isListed
  );

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <h2>{account ? "Your Collections ✨" : "Connect Wallet 💭"}</h2>
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
        {filteredNFTs?.map((nft) => (
          <Link
            to={`/nft/${nft.tokenId}`}
            key={nft.tokenId}
            className={styles.nftLink}
          >
            <div className={styles.nftItem}>
              <img src={nft.image} alt={nft.name} />
              <div className={styles.nftName}>{nft.name}</div>
              <div className={styles.nftDescription}>{nft.description}</div>

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
        ))}
      </div>
    </div>
  );
};

export default Profile;
