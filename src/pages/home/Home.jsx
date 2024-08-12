import { Headings, Page, Texts } from "@/components";
import { useStore } from "@/hooks";
import { Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import { IoIosCheckmarkCircle, IoIosPeople } from "react-icons/io";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "../styles.module.css";
import { useLoaderData, useNavigation } from "react-router-dom";
import { useMemo } from "react";
import { IoBagSharp } from "react-icons/io5";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { formatCurrency } from "@/utils";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const navigation = useNavigation();
  const { loggedInUser, merchant } = useStore();
  const { data } = useLoaderData() || {};
  const merchantData = useMemo(() => data || {}, [data]);
  const {
    customerCount,
    findTotalNotPaid,
    findTotalPaid,
    orderCount,
    totalSales,
  } = merchantData;

  return (
    <>
      <Helmet>
        <title>Teem, Welcome {loggedInUser?.username || "Guest"}</title>
        <meta
          name="description"
          content="Teem Merchant dashboard."
        />
      </Helmet>
      <Page>
        {navigation.state === "loading" ? (
          <div className="text-center my-3">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <>
            {merchant ? (
              <>
                <Headings text="Order summary" size="1.5rem" />
                <Row className="mt-4">
                  <Col md={4} className="mb-3">
                    <div
                      className="d-flex gap-3 justify-content-center align-items-center border rounded-3 shadow-sm bg-light"
                      style={{ height: "100px" }}
                    >
                      <IoIosPeople size="40px" color="#0d9488" />
                      <div className="mt-2 text-center">
                        <Texts
                          text="Customers"
                          size="1rem"
                          className="fw-bold mt-2 mb-0"
                        />
                        <Texts
                          text={customerCount}
                          size="1.3rem"
                          className="fw-bold text-info"
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div
                      className="d-flex gap-3 justify-content-center align-items-center border rounded-3 shadow-sm bg-light"
                      style={{ height: "100px" }}
                    >
                      <IoBagSharp size="40px" color="#082f49" />
                      <div className="mt-2 text-center">
                        <Texts
                          text="Orders"
                          size="1rem"
                          className="fw-bold mt-2 mb-0"
                        />
                        <Texts
                          text={orderCount}
                          size="1.3rem"
                          className="fw-bold text-warning"
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div
                      className="d-flex gap-3 justify-content-center align-items-center border rounded-3 shadow-sm bg-light"
                      style={{ height: "100px" }}
                    >
                      <FaMoneyBillTrendUp size="40px" color="green" />
                      <div className="mt-2 text-center">
                        <Texts
                          text="Sales"
                          size="1rem"
                          className="fw-bold mt-2 mb-0"
                        />
                        <Texts
                          text={
                            totalSales &&
                            formatCurrency(merchant?.currency, totalSales)
                          }
                          size="1.3rem"
                          className="fw-bold text-success"
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="mt-4">
                  <div className="d-flex gap-2 align-items-cente">
                    <div
                      className="bg-success p-2 mt-1"
                      style={{ height: "10px" }}
                    ></div>
                    <Texts
                      text="Total paid:"
                      size="1rem"
                      className="fw-bold mb-0"
                    />
                    <Texts
                      text={formatCurrency(
                        merchant?.currency,
                        findTotalPaid ? findTotalPaid : 0
                      )}
                      size="1rem"
                      className="fw-bold text-success"
                    />
                  </div>
                  <div className="d-flex gap-2 align-items-cente">
                    <div
                      className="bg-danger p-2 mt-1"
                      style={{ height: "10px" }}
                    ></div>
                    <Texts
                      text="Outstanding:"
                      size="1rem"
                      className="fw-bold mb-0"
                    />
                    <Texts
                      text={formatCurrency(
                        merchant?.currency,
                        findTotalNotPaid ? findTotalNotPaid : 0
                      )}
                      size="1rem"
                      className="fw-bold text-success"
                    />
                  </div>
                </div>
              </>
            ) : (
              <Row className="mt-5 gy-4">
                <Col md={6} className="fw-semibold">
                  <Headings
                    text={`Welcome, ${loggedInUser?.username}`}
                    size="1.5rem"
                  />
                  <Texts
                    text="We're here to help you get things rolling."
                    className="mt-4 "
                  />
                  <div className="mt-4">
                    <div className="d-flex gap-2 align-items-center">
                      <IoIosCheckmarkCircle color="#0d9488" size="40px" />
                      <Texts
                        text="Add your products."
                        className="fw-bold text-success mt-3"
                      />
                    </div>
                    <div className="mt-4 d-flex gap-2 align-items-center">
                      <IoIosCheckmarkCircle color="#0d9488" size="40px" />
                      <Texts
                        text="Run promos using discount codes."
                        className="fw-bold text-success mt-3"
                      />
                    </div>
                    <div className="mt-4 d-flex gap-2 align-items-center">
                      <IoIosCheckmarkCircle color="#0d9488" size="40px" />
                      <Texts
                        text="See orders from customers."
                        className="fw-bold text-success mt-3"
                      />
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <LazyLoadImage
                    src={
                      "https://unsplash.com/photos/F1I4IN86NiE/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGVjb21tZXJjZXxlbnwwfHx8fDE3MTQyNjcwODB8MA&force=true&w=1920"
                    }
                    alt="ecommerce"
                    className="w-100 object-fit-cover"
                    style={{ height: "300px" }}
                  />
                </Col>
              </Row>
            )}
          </>
        )}

        <br />
        <hr />
        <div className="mt-5 d-flex justify-content-center">
          <Card style={{ maxWidth: "25rem" }}>
            <Card.Body>
              <Card.Title className="fw-bold">
                Have a message for us?
              </Card.Title>
              <Card.Text className="fw-semibold">
                Our commerce experts can make sure Teem is the right fit for
                your business and help architect a solution.
              </Card.Text>
              <Button
                href="mailto:charlesmutob@gmail.com"
                variant="none"
                size="lg"
                className={`${styles.msgBtn} w-100 text-white fw-bold fs-6`}
              >
                Message us <FaArrowRight />
              </Button>
            </Card.Body>
          </Card>
        </div>
      </Page>
    </>
  );
};

export default Home;
