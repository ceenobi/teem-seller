import { ActionButton, Headings, NoCategory, Page } from "@/components";
import {
  Link,
  useLoaderData,
  Outlet,
  useLocation,
  useNavigation,
} from "react-router-dom";
import { Badge, Spinner, Table } from "react-bootstrap";
import { useStore } from "@/hooks";
import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";

const Categories = () => {
  const { data } = useLoaderData();
  const categoryList = useMemo(() => data, [data]);
  const location = useLocation();
  const navigation = useNavigation();
  const { getCategories, setGetCategories } = useStore();

  useEffect(() => {
    setGetCategories(categoryList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>View your categories</title>
        <meta name="description" content="Your created categories." />
      </Helmet>
      {location.pathname === "/categories" ? (
        <>
          {categoryList?.length > 0 ? (
            <Page>
              <div className="d-flex justify-content-between align-items-center">
                <Headings text="Categories" size="1.5rem" />
                <ActionButton
                  text={<>ADD +</>}
                  size="sm"
                  as={Link}
                  to="/categories/add"
                  style={{ backgroundColor: "var(--bg-green-100)" }}
                />
              </div>
              {navigation.state === "loading" ? (
                <div className="text-center my-3">
                  <Spinner animation="border" size="sm" />
                </div>
              ) : (
                <Table hover striped bordered responsive className="mt-5">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>DESCRIPTION</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCategories.map(({ name, description, _id }) => (
                      <tr key={_id}>
                        <td>{name}</td>
                        <td>{description}</td>
                        <td>
                          <Badge
                            bg="danger"
                            text="light"
                            as={Link}
                            to={`/categories/${_id}`}
                          >
                            VIEW
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Page>
          ) : (
            <NoCategory />
          )}
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Categories;
