import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import styles from "../styles/NFTDetails.module.scss";
import SetPrice from "../components/SetPrice";
import TokenHistory from "../components/TokenHistory";
import { useMinter } from "../utils/contexts/MinterContext";
import { useMarketplace } from "../utils/contexts/MarketplaceContext";
import { HomePage } from "./HomePage";

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
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const {
    data: combinedResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["nftDetails"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_URL as string}/nfts/nft/${tokenId}`
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
      return await fetch(`${process.env.REACT_APP_URL as string}/marketplace/list-nft`, {
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
      return await fetch(`${process.env.REACT_APP_URL as string}/marketplace/cancel-list`, {
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
      return await fetch(`${process.env.REACT_APP_URL as string}/marketplace/buy-nft`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading NFT details</div>;

  const handleList = async () => {
    setIsDisabled(true);
    setToggle(true);
  };

  const confirmList = async () => {
    setToggle(false);
    const response = await listNftMutation.mutateAsync();
    if (!listPrice) return alert("Please enter a price");

    await listNft(Number(combinedResponse?.nft.tokenId), listPrice);
    setIsDisabled(false);

    refetch(); // refetch the data to update the UI

    console.log(response);
  };

  const handleCancelListing = async () => {
    setIsDisabled(true);
    const response = await cancelListMutation.mutateAsync();
    await cancelListing(Number(combinedResponse?.nft.tokenId));
    setIsDisabled(false);

    refetch(); // refetch the data to update the UI

    console.log(response);
  };

  const handleBuy = async () => {
    setIsDisabled(true);
    const response = await buyNftMutation.mutateAsync();
    await buyNft(Number(combinedResponse?.nft.tokenId));
    setIsDisabled(false);

    refetch(); // refetch the data to update the UI

    console.log(response);
  };

  const date = combinedResponse?.nft.createdAt
    ? new Date(combinedResponse?.nft.createdAt).toLocaleString()
    : "";

  let currentOwner =
    combinedResponse?.nft.history[combinedResponse?.nft.history.length - 1];
  let isListed = combinedResponse?.nft.isListed;


  return (
    <>
      {toggle && (
        <SetPrice
          toggle={toggle}
          setToggle={setToggle}
          listPrice={listPrice}
          setListPrice={setListPrice}
          confirmList={confirmList}
          setIsDisabled={setIsDisabled}
          isDisabled={isDisabled}
        />
      )}
      <div className={styles.container}>
        <div className={styles.nftDetail}>
          <img
            src={combinedResponse?.nft.image}
            alt={combinedResponse?.nft.name}
          />
          <div className={styles.nftInfo}>
            <h1>{combinedResponse?.nft.name}</h1>
            <p>{combinedResponse?.nft.description}</p>
            <p>Token ID: {combinedResponse?.nft.tokenId}</p>
            <p>Created At: {date}</p>
          </div>

          <div
            className={`${styles.options} ${isDisabled ? styles.disabled : ""}`}
            onClick={
              !isDisabled
                ? currentOwner === account
                  ? isListed
                    ? handleCancelListing
                    : handleList
                  : isListed
                  ? handleBuy
                  : undefined
                : undefined
            }
          >
            {!isDisabled
              ? currentOwner === account
                ? isListed
                  ? "Cancel Listing"
                  : "List"
                : isListed
                ? "Buy"
                : "Not Listed Yet"
              : "Loading..."}
          </div>
        </div>
      </div>

      <div className={styles.tokenHistory}>
        <TokenHistory history={combinedResponse?.tokenHistory} />
      </div>
    </>
  );
};

export default NFTDetails;
