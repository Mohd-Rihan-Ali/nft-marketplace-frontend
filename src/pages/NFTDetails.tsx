import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import styles from "../styles/NFTDetails.module.scss";
import Transfer from "../components/Transfer";
import { useMinter } from "../utils/contexts/MinterContext";
import { useMarketplace } from "../utils/contexts/MarketplaceContext";
import SetPrice from "../components/SetPrice";

interface NFT {
  name: string;
  description: string;
  image: string;
  tokenId: number;
  createdAt: Date;
  isListed: boolean;
  history: string[];
}

const NFTDetails = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const { listNft, cancelListing, buyNft } = useMarketplace();
  const { account } = useMinter();
  const [listPrice, setListPrice] = useState<number>(0);
  const [toggle, setToggle] = useState<boolean>(false);

  const {
    data: nft,
    isLoading,
    error,
  } = useQuery<NFT>({
    queryKey: ["nftDetails"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8801/nfts/nft/${tokenId}`
      );
      return response.data;
    },
    enabled: !!tokenId,
  });

  const listNftMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("isListed", "true");
      formData.append("tokenId", tokenId as string);
      return await fetch("http://localhost:8801/marketplace/list-nft", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
    },
  });

  const cancelListMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("isListed", "false");
      formData.append("tokenId", tokenId as string);
      return await fetch("http://localhost:8801/marketplace/cancel-list", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
    },
  });

  const buyNftMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("isListed", "false");
      formData.append("tokenId", tokenId as string);
      return await fetch("http://localhost:8801/marketplace/buy-nft", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading NFT details</div>;

  const handleList = async () => {
    setToggle(true);
  };

  const confirmList = async () => {
    setToggle(false);
    const response = await listNftMutation.mutateAsync();
    if (!listPrice) return alert("Please enter a price");
    listNft(Number(nft?.tokenId), Number(listPrice));
    console.log(response);
  };

  const handleCancelListing = async () => {
    const response = await cancelListMutation.mutateAsync();
    cancelListing(Number(nft?.tokenId));
    console.log(response);
  };

  const handleBuy = async () => {
    const response = await buyNftMutation.mutateAsync();
    buyNft(Number(nft?.tokenId));
    console.log(response);
  };

  const date = nft?.createdAt ? new Date(nft.createdAt).toLocaleString() : "";

  let currentOwner = nft?.history[nft.history.length - 1];
  let isListed = nft?.isListed;

  return (
    <>
      {toggle && (
        <SetPrice
          toggle={toggle}
          setToggle={setToggle}
          listPrice={listPrice}
          setListPrice={setListPrice}
          confirmList={confirmList}
        />
      )}
      <div className={styles.container}>
        <div className={styles.nftDetail}>
          <img src={nft?.image} alt={nft?.name} />
          <div className={styles.nftInfo}>
            <h1>{nft?.name}</h1>
            <p>{nft?.description}</p>
            <p>Token ID: {nft?.tokenId}</p>
            <p>Created At: {date}</p>
            <div className={styles.history}>
              <p>History:</p>
              {nft?.history.map((h: string, id: number) => (
                <div key={id} className={styles.ids}>
                  {id}: {h}
                </div>
              ))}
            </div>
          </div>
          <div
            className={styles.options}
            onClick={
              currentOwner === account
                ? isListed
                  ? handleCancelListing
                  : handleList
                : isListed
                ? handleBuy
                : undefined
            }
          >
            {currentOwner === account
              ? isListed
                ? "Cancel Listing"
                : "List"
              : isListed
              ? "Buy"
              : ""}
          </div>
        </div>
      </div>
    </>
  );
};

export default NFTDetails;
