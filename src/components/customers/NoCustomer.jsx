import Headings from "../Headings";
import Page from "../Page";
import CardBox from "../CardBox";
import Texts from "../Texts";
import styles from "../../pages/styles.module.css";

const NoCustomer = () => {
  return (
    <div className={`${styles.customerBg} p-0`}>
      <Page>
        <Headings text="Customers" size="1.5rem" />
        <div
          className="mt-5 d-flex justify-content-center align-items-center"
          style={{ minHeight: "50dvh" }}
        >
          <CardBox style={{ maxWidth: "450px", opacity: "0.9" }}>
            <Texts
              text="See your customers."
              size="1.2rem"
              className="fw-bold text-center"
            />
            <Texts
              text="See all who have placed orders on your site, track their spendings, as well message them."
              size="1rem"
              className="fw-medium text-center"
            />
          </CardBox>
        </div>
      </Page>
    </div>
  );
};

export default NoCustomer;
