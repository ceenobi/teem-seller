import { customerService } from "@/api";
import {
  ActionButton,
  CardBox,
  Headings,
  ModalBox,
  Page,
  Texts,
} from "@/components";
import { useStore } from "@/hooks";
import { formatCurrency, formatDate, handleError } from "@/utils";
import React, { useMemo, useState } from "react";
import { Badge, Col, Row, Spinner, Table } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { IoMdArrowBack } from "react-icons/io";
// import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  Link,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "timeago.js";

const CustomerOrders = () => {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { data } = useLoaderData();
  const customerDetails = useMemo(() => data, [data]);
  const { merchant, token, setGetCustomers } = useStore();
  const { customer, customerOrders } = customerDetails;

  const deleteCustomer = async () => {
    setIsDeleting(true);
    try {
      const { status, data } = await customerService.deleteACustomer(
        merchant.merchantCode,
        customer.username,
        token
      );
      if (status === 200) {
        toast.success(data.msg);
        setGetCustomers((prevData) => {
          const filteredCustomers = prevData.filter(
            (cus) => cus._id !== customer?._id
          );
          return [
            ...filteredCustomers.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ),
          ];
        });
        navigate("/customers");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{customer?.username}</title>
        <meta name="description" content="Your customer detail." />
      </Helmet>
      <Page>
        <Texts
          text={
            <>
              <IoMdArrowBack />
              Customers
            </>
          }
          size="16px"
          className="fw-bold mb-5 cursor"
          onClick={() => navigate("/products")}
        />
        <Headings text="Customer overview" size="1.5rem" />
        {navigation.state === "loading" ? (
          <div className="text-center my-3">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <Row>
            <Col md={7} xl={8}>
              <CardBox>
                <div className="d-flex gap-2 align-items-center mb-4">
                  {/* <LazyLoadImage
                    src={customer?.photo}
                    alt={customer?.username}
                    style={{ width: "45px", height: "45px" }}
                    className="object-fit-cover rounded-circle"
                  /> */}
                  <div>
                    <Texts
                      text={customer?.username}
                      size="16px"
                      className="fw-bold mb-0"
                    />
                    <a
                      href={`mailto:${customer?.email}`}
                      className="text-success"
                    >
                      {customer?.email}
                    </a>
                  </div>
                </div>
                <div className="bg-secondary-subtle rounded-3 p-3">
                  <div className="d-flex justify-content-between">
                    <div className="text-center">
                      <Texts
                        text="LAST ORDER"
                        size="12px"
                        className="fw-semibold mb-0"
                      />
                      <Texts
                        text={formatDate(customer?.updatedAt)}
                        size="16px"
                        className="fw-bold mb-0"
                      />
                    </div>
                    <div className="text-center">
                      <Texts
                        text="TOTAL SPENT"
                        size="12px"
                        className="fw-semibold mb-0"
                      />
                      <Texts
                        text={formatCurrency(
                          merchant?.currency,
                          customer?.totalSpent
                        )}
                        size="16px"
                        className="fw-bold mb-0 text-success"
                      />
                    </div>
                    <div className="text-center">
                      <Texts
                        text="TOTAL ORDERS"
                        size="12px"
                        className="fw-semibold mb-0"
                      />
                      <Texts
                        text={customer?.totalOrders}
                        size="16px"
                        className="fw-bold mb-0"
                      />
                    </div>
                  </div>
                  <hr />
                  <Texts
                    text={
                      <>
                        CREATED: <b>{formatDate(customer?.createdAt)}</b> @{" "}
                        {format(customer?.createdAt)}
                      </>
                    }
                    size="12px"
                    className="fw-semibold text-uppercase text-center"
                  />
                </div>
              </CardBox>
              <CardBox>
                <Texts
                  text="RECENT ORDER"
                  size="12px"
                  className="fw-semibold mb-1"
                />
                {customerOrders && customerOrders.length > 0 && (
                  <div className="bg-secondary-subtle p-3 rounded-3">
                    <div className="d-flex justify-content-between align-items-cente">
                      <Link to={`/orders/${customerOrders[0]?._id}`}>
                        <Badge bg="secondary" text="light">
                          {customerOrders[0]?._id}
                        </Badge>
                      </Link>
                      <Texts
                        text={`${customerOrders[0]?.orderItems?.length} Item(s)`}
                        size="14px"
                        className="fw-medium mb-3"
                      />
                      <Texts
                        text={
                          <>
                            Payment:{" "}
                            <b>
                              {customerOrders[0]?.isPaid ? "Paid" : "Not Paid"}
                            </b>
                          </>
                        }
                        size="14px"
                        className="fw-medium mb-3"
                      />
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Texts
                          text={
                            customerOrders[0]?.isPaid
                              ? "TOTAL PAID"
                              : "OUTSTANDING"
                          }
                          size="12px"
                          className="fw-semibold mb-0"
                        />
                        <Texts
                          text={formatCurrency(
                            merchant?.currency,
                            customerOrders[0]?.total
                          )}
                          size="16px"
                          className={`fw-bold mb-0 ${
                            customerOrders[0]?.isPaid
                              ? "text-success"
                              : "text-danger"
                          }`}
                        />
                      </div>
                      <Badge
                        pill
                        bg="dark"
                        text="light"
                        className="p-2"
                        as={Link}
                        to={`/orders/${customerOrders[0]?._id}`}
                      >
                        VIEW ORDER
                      </Badge>
                    </div>
                  </div>
                )}
              </CardBox>
              <CardBox>
                <Texts
                  text="ORDER HISTORY"
                  size="12px"
                  className="fw-semibold mb-1"
                />
                {customerOrders && customerOrders.length > 0 ? (
                  <Table hover striped bordered responsive>
                    <thead>
                      <tr>
                        <th>ORDER ID</th>
                        <th>DATE</th>
                        <th>STATUS</th>
                        <th>AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerOrders?.map(
                        ({ _id, createdAt, orderStatus, isPaid, total }) => (
                          <React.Fragment key={_id}>
                            <tr
                              key={_id}
                              className="small cursor fw-medium"
                              onClick={() => navigate(`/orders/${_id}`)}
                              title="click to view"
                            >
                              <td>{_id}</td>
                              <td>{formatDate(createdAt)}</td>
                              <td
                                className={`text-uppercase font-semibold ${
                                  orderStatus !== "fulfilled"
                                    ? "text-warning"
                                    : "text-success"
                                }`}
                              >
                                {orderStatus}
                              </td>
                              <td
                                className={`${isPaid ? "text-success" : "text-danger"} fw-semibold`}
                              >
                                {formatCurrency(merchant?.currency, total)}
                              </td>
                            </tr>
                          </React.Fragment>
                        )
                      )}
                    </tbody>
                  </Table>
                ) : (
                  <Texts text="No order history found" className="mt-3" />
                )}
              </CardBox>
            </Col>
            <Col md={5} xl={4}>
              <CardBox>
                <Texts
                  text="DELETE CUSTOMER"
                  size="14px"
                  className="fw-semibold mb-2"
                />
                <Texts
                  text="This action cannot be undone"
                  size="14px"
                  className="mb-2"
                />
                <Texts
                  text="DELETE CUSTOMER"
                  className="text-center fw-bold bg-danger p-2 text-white cursor"
                  size="12px"
                  onClick={() => setShowModal(true)}
                />
              </CardBox>
            </Col>
          </Row>
        )}
        <ModalBox
          show={showModal}
          handleClose={() => setShowModal(false)}
          title="Delete customer"
          backdrop="static"
        >
          <Texts
            text="You are about to permanently delete this customer"
            className="fw-bold"
          />
          <Texts text="Deleting this customer is permanent and cannot be reversed. Are you sure?" />
          <div className="d-flex justify-content-end align-items-center gap-3">
            <ActionButton
              text="Cancel"
              variant="secondary"
              onClick={() => setShowModal(false)}
              size="sm"
            />
            <ActionButton
              text="DELETE"
              pending={isDeleting}
              disabled={isDeleting}
              className="bg-danger w-25"
              onClick={deleteCustomer}
              size="sm"
            />
          </div>
        </ModalBox>
      </Page>
    </>
  );
};

export default CustomerOrders;
