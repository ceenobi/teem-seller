import { Link } from "react-router-dom";
import ActionButton from "../ActionButton";
import Headings from "../Headings";
import Page from "../Page";
import CardBox from "../CardBox";
import Texts from "../Texts";
import styles from "../../pages/styles.module.css";

const NoProducts = () => {
  return (
    <div className={`${styles.productsBg}`}>
      <Page>
        <div className="d-flex justify-content-between align-items-center">
          <Headings text="Products" size="1.5rem" />
          <ActionButton
            text={<>ADD +</>}
            size="sm"
            as={Link}
            to="/products/add"
            style={{ backgroundColor: "var(--bg-green-100)" }}
          />
        </div>
        <div
          className="mt-5 d-flex justify-content-center align-items-center"
          style={{ minHeight: "50dvh" }}
        >
          <CardBox style={{ maxWidth: "450px", opacity: "0.9" }}>
            <Texts text="Add your products" size="1.2rem" className="fw-bold" />
            <Texts
              text="Add your products, set price, quantity and many more. Time to sell."
              size="1rem"
              className="fw-medium"
            />
            <div className="d-flex justify-content-end">
              <ActionButton
                text={<>ADD +</>}
                size="sm"
                as={Link}
                to="/products/add"
                style={{ backgroundColor: "var(--bg-green-100)" }}
              />
            </div>
          </CardBox>
        </div>
      </Page>
    </div>
  );
};

export default NoProducts;
