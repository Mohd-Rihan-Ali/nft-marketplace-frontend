import { useState } from "react";
import styles from "../styles/SetPrice.module.scss";


const handleSetPrice = (setToggle:any, setListPrice:any) => {

    setToggle(false);

};

const SetPrice = (props:any) => {
    const [price, setPrice] = useState<number>(0);
  return (
    <div className={styles.setprice}>
      <div className={styles.container}>
        <h1 className={styles.setprice__title}>Set Price</h1>
        <div className={styles.price}>
          <input
            type="text"
            placeholder="Enter Price"
            className={styles.setprice__input}
            onChange={(e) => setPrice(parseInt(e.target.value))}
          />
          <button onClick={() => handleSetPrice(props.setToggle, props.setListPrice)} >Set Price</button>
        </div>
      </div>
    </div>
  );
};

export default SetPrice;
