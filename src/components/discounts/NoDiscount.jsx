import { Link } from "react-router-dom";
import ActionButton from "../ActionButton";
import Headings from "../Headings";
import Page from "../Page";
import CardBox from "../CardBox";
import Texts from "../Texts";
import styles from "../../pages/styles.module.css";

const NoDiscount = () => {
  return (
    <div className={`${styles.discountBg}`}>
      <Page>
        <div className="d-flex justify-content-between align-items-center">
          <Headings text="Discounts" size="1.5rem" />
          <ActionButton
            text={<>ADD +</>}
            size="sm"
            as={Link}
            to="/discounts/add"
            style={{ backgroundColor: "var(--bg-green-100)" }}
          />
        </div>
        <div
          className="mt-5 d-flex justify-content-center align-items-center"
          style={{ minHeight: "50dvh" }}
        >
          <CardBox style={{ maxWidth: "450px", opacity: "0.9" }}>
            <Texts
              text="Add a discount code and run a promotion."
              size="1.2rem"
              className="fw-bold"
            />
            <Texts
              text="Add % based discount codes, their quantity, start and end dates."
              size="1rem"
              className="fw-medium"
            />
            <div className="d-flex justify-content-end">
              <ActionButton
                text={<>ADD +</>}
                size="sm"
                as={Link}
                to="/discounts/add"
                style={{ backgroundColor: "var(--bg-green-100)" }}
              />
            </div>
          </CardBox>
        </div>
      </Page>
    </div>
  );
};

export default NoDiscount;
