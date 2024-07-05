import React, { useState } from "react";
import styles from "../styles/SetPrice.module.scss";

interface SetPriceProps {
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
  setListPrice: (price: number) => void;
  listPrice: number;
  confirmList: () => void;
}

const SetPrice: React.FC<SetPriceProps> = ({
  setToggle,
  setListPrice,
  listPrice,
  confirmList,
}) => {
  //   const [price, setPrice] = useState<number>(0);

  const handleSubmit = () => {
    if (!listPrice) return alert("Please enter a price");
    setListPrice(listPrice);
    confirmList();
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <h2>Set Listing Price</h2>
        <input
          type="number"
          value={listPrice}
          onChange={(e) => setListPrice(Number(e.target.value))}
          placeholder="Enter price"
        />
        <div className={styles.buttons}>
          <button onClick={handleSubmit} className={styles.buttonGo}>
            Go
          </button>
          <button
            onClick={() => setToggle(false)}
            className={styles.buttonCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetPrice;
