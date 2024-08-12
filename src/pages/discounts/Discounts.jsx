import { ActionButton, Headings, NoDiscount, Page } from "@/components";
import { useStore } from "@/hooks";
import { formatDate } from "@/utils";
import classnames from "classnames";
import { useEffect, useMemo } from "react";
import { Badge, Spinner, Table } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";

const Discounts = () => {
  const { data } = useLoaderData();
  const discounts = useMemo(() => data, [data]);
  const { getDiscounts, setGetDiscounts } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();

  useEffect(() => {
    setGetDiscounts(discounts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>View your discounts</title>
        <meta name="description" content="Create promos using discounts" />
      </Helmet>
      {location.pathname === "/discounts" ? (
        <>
          {discounts?.length > 0 ? (
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
              {navigation.state === "loading" ? (
                <div className="text-center my-3">
                  <Spinner animation="border" size="sm" />
                </div>
              ) : (
                <Table striped hover bordered responsive className="mt-5">
                  <thead>
                    <tr>
                      <th>CODE</th>
                      <th>VALUE</th>
                      <th>START DATE</th>
                      <th>EXPIRES</th>
                      <th>QTY</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getDiscounts.map(
                      ({
                        _id,
                        discountCode,
                        discountValue,
                        startDate,
                        endDate,
                        quantity,
                        enabled,
                      }) => (
                        <tr
                          key={_id}
                          className="small align-items-center cursor fw-medium"
                          onClick={() => navigate(`/discounts/${_id}`)}
                        >
                          <td>
                            <Badge bg="success" text="light">
                              {discountCode}
                            </Badge>
                          </td>
                          <td>{discountValue} %</td>
                          <td>{startDate ? formatDate(startDate) : "NEVER"}</td>
                          <td>{endDate ? formatDate(endDate) : "NEVER"}</td>
                          <td>{quantity ? quantity : "ALL"}</td>
                          <td
                            className={classnames({
                              "fw-bold": true,
                              "text-success": enabled,
                              "text-info": !enabled,
                            })}
                          >
                            {enabled ? "ACTIVE" : "INACTIVE"}{" "}
                          </td>
                          <td>
                            <Badge
                              bg="danger"
                              text="light"
                              as={Link}
                              to={`/discounts/${_id}`}
                            >
                              VIEW
                            </Badge>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
              )}
            </Page>
          ) : (
            <NoDiscount />
          )}
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Discounts;
