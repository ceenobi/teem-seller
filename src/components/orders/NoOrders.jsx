import Headings from "../Headings";
import Page from "../Page";
import CardBox from "../CardBox";
import Texts from "../Texts";
import styles from "../../pages/styles.module.css";

const NoOrders = () => {
  return (
    <div className={`${styles.ordersBg}`}>
      <Page>
        <Headings text="Orders" size="1.5rem" />
        <div className="mt-5 d-flex justify-content-center align-items-center" style={{minHeight:"50dvh"}}>
          <CardBox style={{ maxWidth: "450px", opacity: "0.9" }}>
            <Texts
              text="Make your first sale!"
              size="1.2rem"
              className="fw-bold text-center"
            />
            <Texts
              text="We'll then show you orders and sales displayed over time. Track your earnings."
              size="1rem"
              className="fw-medium text-center"
            />
          </CardBox>
        </div>
      </Page>
    </div>
  );
};

export default NoOrders;
