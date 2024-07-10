import React, { useState } from "react";
import { useMinter } from "../utils/contexts/MinterContext";
import { useMutation } from "@tanstack/react-query";
import styles from "../styles/Transfer.module.scss";
import { useMarketplace } from "../utils/contexts/MarketplaceContext";
import ConnectWallet from "./ConnectWallet";

const Transfer = (prop: any) => {
  const { owner, transfer, account, connectWallet } = useMinter();
  const { connectWallet: marketplaceWallet } = useMarketplace();

  const [to, setTo] = useState("");

  const transferMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (owner && to && prop.tokenId) {
        formData.append("owner", owner || "");
        formData.append("to", to || "");
        formData.append("fTokenId", prop.tokenId?.toString() || "");
      }
      return await fetch(`${process.env.REACT_APP_URL as string}/transfer`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
    },
  });
  if (transferMutation.isPending) return <>Loading...</>;
  if (transferMutation.isError)
    return <>Error: {transferMutation.error.message}</>;

  const handleConnectWallet = () => {
    connectWallet();
    marketplaceWallet();
  };

  const handleTransfer = async () => {
    if (!to || !prop.tokenId) {
      alert("Recipient or Token ID is not defined");
      console.error("Recipient or Token ID is not defined");
      return;
    }
    const response = await transferMutation.mutateAsync();
    await transfer(to, prop.tokenId);

    console.log(response.data);
  };

  return (
    <div className={styles.transfer}>
      <div className={styles.form}>
        <h2>Transfer NFT</h2>
        <input
          type="text"
          name="to"
          id="to"
          placeholder="To Address"
          onChange={(e) => setTo(e.target.value)}
        />
        <button onClick={account ? handleTransfer : handleConnectWallet}>
          {account ? "Transfer" : `Connect Wallet `}
        </button>
      </div>
    </div>
  );
};

export default Transfer;
