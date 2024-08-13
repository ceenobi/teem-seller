import { orderService } from "@/api";
import { ActionButton, CardBox, ModalBox, Page, Texts } from "@/components";
import { useStore } from "@/hooks";
import {
  formatCurrency,
  formatDate,
  handleError,
  orderProgress,
} from "@/utils";
import classnames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { Badge, Col, Row, Spinner } from "react-bootstrap";
import { IoMdArrowBack } from "react-icons/io";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "timeago.js";
import { GrMoney } from "react-icons/gr";
import { TbTruckDelivery } from "react-icons/tb";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { Helmet } from "react-helmet-async";

const OrderDetail = () => {
  const [orderStatus, setOrderStatus] = useState("open");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { data } = useLoaderData();
  const orderDetails = useMemo(() => data, [data]);
  const { merchant, token, setGetOrders, getOrderDetail, setGetOrderDetail } =
    useStore();
  const [isPaid, setIsPaid] = useState(getOrderDetail?.isPaid);
  const [isDelivered, setIsDelivered] = useState(getOrderDetail?.isDelivered);

  useEffect(() => {
    setGetOrderDetail(orderDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOrder = async () => {
    const credentials = {
      orderStatus,
      isPaid,
      isDelivered,
    };
    setIsUpdating(true);
    try {
      const { status, data } = await orderService.updateAnOrderStatus(
        merchant.merchantCode,
        getOrderDetail._id,
        credentials,
        token
      );
      if (status === 200) {
        toast.success(data.msg);
        setShowModal(false);
        setGetOrderDetail(data.updatedOrder);
        setGetOrders((prevData) => {
          const updatedOrders = [
            ...(Array.isArray(prevData)
              ? prevData.filter((order) => order._id !== data.updatedOrder._id)
              : []),
            data.updatedOrder,
          ];
          return [
            ...updatedOrders.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ),
          ];
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Order detail</title>
        <meta
          name="description"
          content="See details of this order and update the status."
        />
      </Helmet>
      <Page>
        <Texts
          text={
            <>
              <IoMdArrowBack />
              Orders
            </>
          }
          size="16px"
          className="fw-bold mb-5 cursor"
          onClick={() => navigate("/orders")}
        />
        {navigation.state === "loading" ? (
          <div className="text-center my-3">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <>
            {getOrderDetail && (
              <Row>
                <Col lg={7} xl={8}>
                  <CardBox>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Texts text="DETAILS" size="12px" className="fw-bold" />
                      <Badge
                        pill
                        bg="dark"
                        text="light"
                        className="p-2 cursor"
                        role="button"
                        onClick={() => setShowModal(true)}
                      >
                        UPDATE ORDER
                      </Badge>
                    </div>
                    <div className="d-flex flex-wrap justify-content-between align-items-center border rounded-3 px-3 py-2">
                      <div className="mt-2">
                        <Texts
                          text="REFERENCE"
                          size="12px"
                          className="fw-bold mb-1"
                        />
                        <Texts
                          text={
                            getOrderDetail?.reference
                              ? getOrderDetail?.reference
                              : getOrderDetail?._id
                          }
                          size="14px"
                          className="fw-semibold text-uppercase"
                        />
                      </div>
                      <div className="mt-2">
                        <Texts
                          text="PLACED"
                          size="12px"
                          className="fw-bold mb-1"
                        />
                        <Texts
                          text={
                            <>
                              {formatDate(getOrderDetail?.createdAt)}
                              &nbsp;@&nbsp;{format(getOrderDetail?.createdAt)}
                            </>
                          }
                          size="12px"
                          className="fw-semibold text-uppercase"
                        />
                      </div>
                    </div>
                    <Row className="rounded-3 mt-4 mx-0 py-2 border">
                      {getOrderDetail?.orderItems?.map((item) => (
                        <React.Fragment key={item._id}>
                          <Col md={6}>
                            <Texts
                              text="ITEM"
                              size="12px"
                              className="fw-bold"
                            />
                            <div className="d-flex gap-3 align-items-center">
                              <LazyLoadImage
                                effect="blur"
                                src={item?.image[0]}
                                alt={item?.name}
                                width={50}
                                height={50}
                                className="object-fit-cover"
                              />
                              <Texts
                                text={item.name}
                                size="12px"
                                className="fw-bold"
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <Texts
                              text="QUANTITY"
                              size="12px"
                              className="fw-bold"
                            />
                            <Texts
                              text={item.quantity}
                              size="12px"
                              className="fw-semibold"
                            />
                          </Col>
                          <Col md={3} className="text-md-end">
                            <Texts
                              text="AMOUNT"
                              size="12px"
                              className="fw-bold"
                            />
                            <Texts
                              text={formatCurrency(
                                merchant?.currency,
                                item.price ? item.price : 0
                              )}
                              size="12px"
                              className={`fw-semibold ${
                                getOrderDetail.isPaid !== true
                                  ? "text-danger"
                                  : "text-success"
                              }`}
                            />
                          </Col>
                        </React.Fragment>
                      ))}
                    </Row>
                    <div className="rounded-3 my-4 py-2 px-3 border">
                      <div className="d-flex justify-content-between">
                        <Texts
                          text="Subtotal"
                          size="15px"
                          className="fw-bold"
                        />
                        <Texts
                          text={formatCurrency(
                            merchant?.currency,
                            getOrderDetail?.subTotal
                          )}
                          size="15px"
                          className="fw-medium"
                        />
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <Texts
                          text="Shipping Fee"
                          size="15px"
                          className="fw-bold"
                        />
                        <Texts
                          text={formatCurrency(
                            merchant?.currency,
                            getOrderDetail?.shippingFee
                          )}
                          size="15px"
                          className="fw-medium"
                        />
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <Texts
                          text="Discount"
                          size="15px"
                          className="fw-bold"
                        />
                        <Texts
                          text={formatCurrency(
                            merchant?.currency,
                            getOrderDetail?.discount
                          )}
                          size="15px"
                          className="fw-medium"
                        />
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <Texts text="Tax" size="15px" className="fw-bold" />
                        <Texts
                          text={formatCurrency(
                            merchant?.currency,
                            getOrderDetail?.taxPrice
                          )}
                          size="15px"
                          className="fw-medium"
                        />
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <Texts text="Total" size="15px" className="fw-bold" />
                        <Texts
                          text={formatCurrency(
                            merchant?.currency,
                            getOrderDetail?.total
                          )}
                          size="15px"
                          className={`fw-bold ${
                            getOrderDetail.isPaid !== true
                              ? "text-danger"
                              : "text-success"
                          }`}
                        />
                      </div>
                    </div>
                  </CardBox>
                  <CardBox>
                    <div className="bg-secondary-subtle d-flex flex-wrap justify-content-between align-items-center border rounded-3 px-3 py-2">
                      <div className="mt-2">
                        <Texts
                          text="PAID AT"
                          size="12px"
                          className="fw-bold text-black mb-1"
                        />
                        <Texts
                          text={
                            getOrderDetail?.paidAt
                              ? formatDate(getOrderDetail?.paidAt)
                              : "Not paid"
                          }
                          size="12px"
                          className="fw-semibold text-uppercase"
                        />
                      </div>
                      <div className="mt-2">
                        <Texts
                          text="DELIVERED AT"
                          size="12px"
                          className="fw-bold text-success mb-1"
                        />
                        <Texts
                          text={
                            getOrderDetail?.deliveredAt ? (
                              <>
                                {formatDate(getOrderDetail?.deliveredAt)}
                                &nbsp;@&nbsp;
                                {format(getOrderDetail?.deliveredAt)}
                              </>
                            ) : (
                              "Not delivered"
                            )
                          }
                          size="12px"
                          className="fw-semibold text-uppercase"
                        />
                      </div>
                    </div>
                  </CardBox>
                </Col>
                <Col lg={5} xl={4}>
                  <CardBox>
                    <div className="d-flex justify-content-between mb-0">
                      <Texts
                        text="Order status"
                        size="15px"
                        className="fw-bold mb-0"
                      />
                      <Texts
                        text={getOrderDetail?.orderStatus}
                        size="12px"
                        className={classnames({
                          "fw-bold rounded-4 text-uppercase text-white text-center p-2 mb-0": true,
                          "bg-warning": getOrderDetail?.orderStatus === "open",
                          "bg-info":
                            getOrderDetail?.orderStatus === "processing",
                          "bg-success":
                            getOrderDetail?.orderStatus === "fulfilled",
                        })}
                        width="125px"
                      />
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-0">
                      <Texts
                        text="Delivery status"
                        size="15px"
                        className="fw-bold mb-0"
                      />
                      <Texts
                        text={
                          getOrderDetail?.isDelivered
                            ? "Delivered"
                            : "Not Delivered"
                        }
                        size="12px"
                        className={`fw-bold rounded-4 text-uppercase text-white text-center p-2 mb-0 ${getOrderDetail?.isDelivered ? "bg-success" : "bg-warning"}`}
                        width="125px"
                      />
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-0">
                      <Texts
                        text="Payment status"
                        size="15px"
                        className="fw-bold mb-0"
                      />
                      <Texts
                        text={getOrderDetail?.isPaid ? "paid" : "not paid"}
                        size="12px"
                        className={`fw-bold rounded-4 text-uppercase text-white text-center p-2 mb-0 ${getOrderDetail?.isPaid ? "bg-success" : "bg-warning"}`}
                        width="125px"
                      />
                    </div>
                  </CardBox>
                  <CardBox>
                    <Texts
                      text="Payment method"
                      size="12px"
                      className="fw-bold text-uppercase"
                    />
                    <Texts
                      text={getOrderDetail?.paymentMethod}
                      size="15px"
                      className="fw-bold text-uppercase"
                    />
                  </CardBox>
                  <CardBox>
                    <Texts
                      text="Shipping address"
                      size="12px"
                      className="fw-bold text-uppercase"
                    />
                    <Texts
                      text="Details"
                      size="15px"
                      className="fw-bold mb-0"
                    />
                    <Texts
                      text={
                        <>
                          {getOrderDetail?.shippingDetails?.address}
                          <br />
                          {getOrderDetail?.shippingDetails?.state}
                          <br />
                          {getOrderDetail?.shippingDetails?.country}
                        </>
                      }
                      size="15px"
                      className="fw-medium"
                    />
                  </CardBox>
                  <CardBox>
                    <Texts
                      text="Customer details"
                      size="12px"
                      className="fw-bold text-uppercase"
                    />
                    <Texts
                      text={
                        <>
                          <b>{getOrderDetail?.shippingDetails?.fullname}</b>
                          <br />
                          {getOrderDetail?.shippingDetails?.phone}
                        </>
                      }
                      size="15px"
                      className="fw-medium"
                    />
                  </CardBox>
                </Col>
              </Row>
            )}
          </>
        )}
      </Page>
      <ModalBox
        show={showModal}
        handleClose={() => setShowModal(false)}
        title="Update order"
        backdrop="static"
      >
        <div className="bg-secondary-subtle p-3 rounded-3">
          <Texts
            text="Order status"
            size="12px"
            className="fw-bold text-uppercase"
          />
          <div className="d-flex flex-wrap justify-content-between align-items-center small">
            <div>
              <BsFillInfoSquareFill size="1.8rem" />
              <Texts
                text={getOrderDetail?.orderStatus}
                size="14px"
                className={classnames({
                  "fw-bold text-uppercase": true,
                  "text-warning": getOrderDetail?.orderStatus === "open",
                  "text-info": getOrderDetail?.orderStatus === "processing",
                  "text-success": getOrderDetail?.orderStatus === "fulfilled",
                })}
              />
            </div>
            <div className="d-flex gap-4 align-items-center text-center">
              {orderProgress.map(({ id, Icon, name }) => (
                <div
                  key={id}
                  className={classnames({
                    "fw-semibold cursor": true,
                    "text-warning p-1 rounded-3 text-uppercase fw-bold":
                      orderStatus === name,
                    "text-success p-1 rounded-3 text-uppercase fw-bold":
                      getOrderDetail?.orderStatus === name,
                  })}
                  onClick={() => setOrderStatus(name)}
                >
                  <Icon size="1.8rem" />
                  <Texts text={name} size="12px" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <hr />
        <div className="bg-secondary-subtle p-3 rounded-3 d-flex justify-content-between align-items-center">
          <div>
            <Texts
              text="Payment status"
              size="12px"
              className="fw-bold text-uppercase"
            />
            <div>
              <GrMoney size="1.8rem" />
              <Texts
                text={getOrderDetail?.isPaid ? "Paid" : "Not Paid"}
                size="14px"
                className={`fw-bold text-uppercase ${getOrderDetail?.isPaid ? "text-success" : "text-danger"}`}
              />
            </div>
          </div>
          <div className="text-center">
            <Texts
              text="TOGGLE STATUS"
              size="12px"
              className="fw-bold mb-2 text-uppercase"
            />
            <div>
              <ActionButton
                text={isPaid ? "Paid" : "Not Paid"}
                size="sm"
                className={classnames({
                  "fw-bold cursor p-2 rounded-2 text-white mx-auto": true,
                  "bg-success": isPaid,
                  "bg-danger": !isPaid,
                })}
                style={{ width: "110px" }}
                onClick={() => setIsPaid((prev) => !prev)}
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="bg-secondary-subtle p-3 rounded-3 d-flex justify-content-between align-items-center">
          <div>
            <Texts
              text="Delivery status"
              size="12px"
              className="fw-bold text-uppercase"
            />
            <div>
              <TbTruckDelivery size="1.8rem" />
              <Texts
                text={
                  getOrderDetail?.isDelivered ? "Delivered" : "Not Delivered"
                }
                size="14px"
                className={`fw-bold text-uppercase ${getOrderDetail?.isDelivered ? "text-success" : "text-danger"}`}
              />
            </div>
          </div>
          <div className="text-center">
            <Texts
              text="TOGGLE STATUS"
              size="12px"
              className="fw-bold mb-2 text-uppercase"
            />
            <div>
              <ActionButton
                text={isDelivered ? "Delivered" : "Not Delivered"}
                size="sm"
                className={classnames({
                  "fw-bold cursor p-2 rounded-2 text-white mx-auto": true,
                  "bg-success": isDelivered,
                  "bg-danger": !isDelivered,
                })}
                style={{ width: "110px" }}
                onClick={() => setIsDelivered((prev) => !prev)}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 d-flex justify-content-end align-items-center gap-3">
          <Texts
            text="Cancel"
            className="fw-bold cursor mt-3"
            role="button"
            onClick={() => setShowModal(false)}
          />
          <ActionButton
            text="UPDATE ORDER"
            pending={isUpdating}
            size="sm"
            style={{
              fontSize: "14px",
              width: "170px",
              backgroundColor: "var(--bg-sky-950)",
            }}
            onClick={updateOrder}
          />
        </div>
      </ModalBox>
    </>
  );
};

export default OrderDetail;
