import {
  CardBox,
  Headings,
  NoOrders,
  Page,
  Paginate,
  Texts,
} from "@/components";
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
  useNavigation,
} from "react-router-dom";
import { Badge, Spinner, Table } from "react-bootstrap";
import { useStore } from "@/hooks";
import { useEffect, useMemo } from "react";
import { formatCurrency, formatDate } from "@/utils";
import { GiMoneyStack } from "react-icons/gi";
import styles from "../styles.module.css";
import { Helmet } from "react-helmet-async";

const Orders = () => {
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const {
    itemsPerPage,
    merchant,
    getOrders,
    setGetOrders,
    orderPage,
    setOrderPage,
  } = useStore();
  const { data } = useLoaderData();
  const orders = useMemo(() => data, [data]);

  useEffect(() => {
    if (orders.currentPage === orderPage) {
      setGetOrders(orders?.orders);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.currentPage, orderPage, setGetOrders]);

  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const totalPages = orders.totalPages;
  const count = orders.count;
  const prevPage = itemsPerPage * (parseInt(orderPage) - 1) > 0;
  const nextPage =
    itemsPerPage * (parseInt(orderPage) - 1) + itemsPerPage < count;
  const firstPage = 1;
   const lastPage = Math.ceil(getOrders?.length / itemsPerPage);

  const handlePageChange = (type) => {
    const newPage =
      type === "prev" ? parseInt(orderPage) - 1 : parseInt(orderPage) + 1;
    params.set("page", newPage);
    setOrderPage(newPage);
    navigate(window.location.pathname + "?" + params.toString());
  };

  const handleFirstPage = () => {
    params.set("page", firstPage);
    navigate(window.location.pathname + "?" + params.toString());
  };

  const handleLastPage = () => {
    params.set("page", lastPage);
    navigate(window.location.pathname + "?" + params.toString());
  };

  return (
    <>
      <Helmet>
        <title>View all orders</title>
        <meta name="description" content="Your orders page, see who is buying." />
      </Helmet>
      {location.pathname === "/orders" ? (
        <div>
          {getOrders?.length > 0 ? (
            <>
              <div
                className={`d-none d-md-flex flex-column justify-content-center align-items-center ${styles.ordersBgMini} `}
              >
                <GiMoneyStack size="4rem" color="red" className="text-center" />
                <CardBox style={{ maxWidth: "450px", opacity: "0.9" }}>
                  <Texts
                    text="Track your sales"
                    size="1.4rem"
                    className="fw-bold text-center"
                  />
                  <Texts
                    text="Your order history as displayed over time. Take action!"
                    size="1.2rem"
                    className="fw-medium text-center"
                  />
                </CardBox>
              </div>
              <Page>
                <Headings text="Orders" size="1.5rem" />
                {navigation.state === "loading" ? (
                  <div className="text-center my-3">
                    <Spinner animation="border" size="sm" />
                  </div>
                ) : (
                  <>
                    <Table hover striped bordered responsive className="mt-5">
                      <thead>
                        <tr>
                          <th>ORDER REF</th>
                          <th>DATE</th>
                          <th>STATUS</th>
                          <th>AMOUNT</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getOrders.map(
                          ({
                            _id,
                            shippingDetails,
                            createdAt,
                            orderStatus,
                            total,
                            isPaid,
                            reference,
                          }) => (
                            <tr
                              key={_id}
                              className="cursor small fw-medium"
                              onClick={() => navigate(`/orders/${_id}`)}
                              title="click to see details"
                            >
                              <td>
                                {shippingDetails.fullname}
                                <br />

                                <span className="text-primary">
                                  {" "}
                                  {reference ? reference : _id}
                                </span>
                              </td>
                              <td>{formatDate(createdAt)}</td>
                              <td className="text-info text-uppercase">
                                <Badge
                                  pill
                                  bg={
                                    orderStatus === "fulfilled"
                                      ? "success"
                                      : orderStatus === "processing"
                                        ? "info"
                                        : "warning"
                                  }
                                  text="light"
                                  className="p-2"
                                >
                                  {orderStatus}
                                </Badge>
                              </td>
                              <td
                                className={`fw-bold ${!isPaid ? "text-danger" : "text-success"}`}
                              >
                                {formatCurrency(merchant?.currency, total)}
                              </td>
                              <td>
                                <Badge
                                  bg="danger"
                                  text="light"
                                  as={Link}
                                  to={`/orders/${_id}`}
                                >
                                  VIEW
                                </Badge>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                    <Paginate
                      prevPage={prevPage}
                      nextPage={nextPage}
                      page={orderPage}
                      handleLastPage={handleLastPage}
                      handleFirstPage={handleFirstPage}
                      handlePageChange={handlePageChange}
                      totalPages={totalPages}
                      lastPage={lastPage}
                      itemsPerPage={itemsPerPage}
                    />
                  </>
                )}
              </Page>
            </>
          ) : (
            <NoOrders />
          )}{" "}
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Orders;
