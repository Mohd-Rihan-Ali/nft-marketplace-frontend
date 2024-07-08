import { useEffect, useRef, useState } from "react";
import { useMinter } from "../utils/contexts/MinterContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import styles from "../styles/Form.module.scss";
import axios from "axios";

interface NFT {
  name: string;
  description: string;
  image: string;
  tokenId: number;
  createdAt: Date;
}

const MintPage = () => {
  const {
    connectWallet,
    mintToken,
    transfer,
    account,
    owner,
    contractName,
    contractSymbol,
  } = useMinter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);

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

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (image) {
        formData.append("file", image);
        formData.append("name", name || "");
        formData.append("description", description || "");
        formData.append("account", account || "");
        formData.append("owner", owner || "");
      }
      return await fetch("http://localhost:8801/mint", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
    },
  });

  // const transferMutation = useMutation({
  //   mutationFn: async () => {
  //     const formData = new FormData();
  //     if (owner && to && fTokenId) {
  //       formData.append("owner", owner || "");
  //       formData.append("to", to || "");
  //       formData.append("fTokenId", fTokenId?.toString() || "");
  //     }
  //     return await fetch("http://localhost:8800/transfer", {
  //       method: "POST",
  //       body: formData,
  //     }).then((res) => res.json());
  //   },
  // });

  if (mutation.isPending) return <>Loading...</>;
  if (mutation.isError) return <>Error: {mutation.error.message}</>;

  // if (transferMutation.isPending) return <>Loading...</>;
  // if (transferMutation.isError)
  //   return <>Error: {transferMutation.error.message}</>;

  const handleImageChange = async (e: any) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleMintToken = async () => {
    if (account && name && description && image) {
      const imageUri = await mutation.mutateAsync();
      console.log("Image URI:", imageUri.response);
      await mintToken(account, imageUri.response);
      setImage(null);
    }
  };

  // const handleTransfer = async () => {
  //   if (!to || !fTokenId) {
  //     console.error("Recipient or Token ID is not defined");
  //     return;
  //   }
  //   const response = await transferMutation.mutateAsync();
  //   await transfer(to, fTokenId);

  //   console.log(response.data);
  // };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Mint NFT</h2>
      </div>

      <div className={styles.form}>
        <form action="submit">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            name="description"
            id="description"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            ref={inputRef}
            type="file"
            name="image"
            id="image"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          {!image && (
            <button
              onClick={(e: any) => {
                e.preventDefault();
                inputRef.current?.click();
              }}
            >
              Upload Image
            </button>
          )}
        </form>
        <button onClick={handleMintToken}>Mint</button>
      </div>

      {/* <div className="transfer">
        <h2>Transfer NFT</h2>
        <input
          type="text"
          name="to"
          id="to"
          placeholder="To Address"
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          type="text"
          name="tokenId"
          id="tokenId"
          placeholder="Token ID"
          onChange={(e) => setFTokenId(Number(e.target.value))}
        />
        <button onClick={handleTransfer}>Transfer</button>
      </div> */}

      {/* <div className={styles.nftGallery}>
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
      </div> */}
    </div>
  );
};

export default MintPage;
