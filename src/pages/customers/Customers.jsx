import { Headings, NoCustomer, Page, Paginate } from "@/components";
import { useStore } from "@/hooks";
import { formatCurrency } from "@/utils";
import { useEffect, useMemo } from "react";
import { Badge, Spinner, Table } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
// import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "react-router-dom";

const Customers = () => {
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const {
    itemsPerPage,
    merchant,
    getCustomers,
    setGetCustomers,
    customerPage,
    setCustomerPage,
  } = useStore();
  const { data } = useLoaderData();
  const customers = useMemo(() => data, [data]);

  useEffect(() => {
    if (customers.currentPage === customerPage) {
      setGetCustomers(customers?.customers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers.currentPage, customerPage, setGetCustomers]);

  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const totalPages = customers.totalPages;
  const count = customers.count;
  const prevPage = itemsPerPage * (parseInt(customerPage) - 1) > 0;
  const nextPage =
    itemsPerPage * (parseInt(customerPage) - 1) + itemsPerPage < count;
  const firstPage = 1;
  const lastPage = Math.ceil(getCustomers.length / itemsPerPage);

  const handlePageChange = (type) => {
    const newPage =
      type === "prev" ? parseInt(customerPage) - 1 : parseInt(customerPage) + 1;
    params.set("page", newPage);
    setCustomerPage(newPage);
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
        <title>View your customers</title>
        <meta name="description" content="Customers." />
      </Helmet>
      {location.pathname === "/customers" ? (
        <>
          {getCustomers?.length > 0 ? (
            <Page>
              <Headings text="Customers" size="1.5rem" />
              {navigation.state === "loading" ? (
                <div className="text-center my-3">
                  <Spinner animation="border" size="sm" />
                </div>
              ) : (
                <>
                  <Table hover striped bordered responsive className="mt-5">
                    <thead>
                      <tr>
                        <th>USERNAME</th>
                        <th>EMAIL</th>
                        <th>TOTAL ORDERS</th>
                        <th>TOTAL SPENT</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCustomers.map(
                        ({
                          _id,
                          username,
                          email,
                          totalOrders,
                          totalSpent,
                        }) => (
                          <tr
                            key={_id}
                            className="small cursor fw-medium"
                            onClick={() => navigate(`/customers/${username}`)}
                            title="click to see more"
                          >
                            <td className="d-flex gap-2 align-items-center">
                              {/* <LazyLoadImage
                                effect="blur"
                                src={photo}
                                alt={username}
                                width={35}
                                height={35}
                                className="object-fit-cover rounded-circle"
                              /> */}
                              <div>{username}</div>
                            </td>
                            <td>{email}</td>
                            <td>{totalOrders}</td>
                            <td className="text-success fw-semibold">
                              {formatCurrency(merchant?.currency, totalSpent)}
                            </td>
                            <td>
                              <Badge
                                bg="danger"
                                text="light"
                                as={Link}
                                to={`/customers/${username}`}
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
                    page={customerPage}
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
          ) : (
            <NoCustomer />
          )}
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Customers;
