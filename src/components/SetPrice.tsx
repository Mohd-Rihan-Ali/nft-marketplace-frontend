import React, { useState } from "react";
import styles from "../styles/SetPrice.module.scss";

interface SetPriceProps {
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
  setListPrice: (price: number) => void;
  listPrice: number;
  confirmList: () => void;
  setIsDisabled: (disabled: boolean) => void;
  isDisabled: boolean;
}

const SetPrice: React.FC<SetPriceProps> = ({
  setToggle,
  setListPrice,
  listPrice,
  confirmList,
  setIsDisabled,
  isDisabled,
}) => {
  const handleSubmit = () => {
    if (!listPrice) return alert("Please enter a price");

    setListPrice(listPrice);
    confirmList();
  };

  const handleCancel = () => {
    setToggle(false);
    setIsDisabled(false);
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <h2>Set Listing Price</h2>
        <input
          type="number"
          value={listPrice.toString()}
          onChange={(e) => setListPrice(e.target.value as any as number)}
          placeholder="Enter price"
        />
        <div className={styles.buttons}>
          <button onClick={handleSubmit} className={styles.buttonGo}>
            Go
          </button>
          <button onClick={handleCancel} className={styles.buttonCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetPrice;
