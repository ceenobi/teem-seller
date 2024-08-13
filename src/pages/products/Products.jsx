import {
  ActionButton,
  Headings,
  NoProducts,
  Page,
  Paginate,
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
import classnames from "classnames";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatCurrency } from "@/utils";
import { Helmet } from "react-helmet-async";

const Products = () => {
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { itemsPerPage, merchant, getProducts, setGetProducts, page, setPage } =
    useStore();
  const { data } = useLoaderData();
  const products = useMemo(() => data, [data]);

  useEffect(() => {
    if (products.currentPage === page) {
      setGetProducts(products?.products);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.currentPage, page, setGetProducts]);

  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const totalPages = products.totalPages;
  const count = products.count;
  const prevPage = itemsPerPage * (parseInt(page) - 1) > 0;
  const nextPage = itemsPerPage * (parseInt(page) - 1) + itemsPerPage < count;
  const firstPage = 1;
  const lastPage = Math.ceil(getProducts.length / itemsPerPage);

  const handlePageChange = (type) => {
    const newPage = type === "prev" ? parseInt(page) - 1 : parseInt(page) + 1;
    params.set("page", newPage);
    setPage(newPage);
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
        <title>View your products</title>
        <meta name="description" content="Your product page" />
      </Helmet>
      {location.pathname === "/products" ? (
        <>
          {getProducts?.length > 0 ? (
            <Page>
              <div className="d-flex justify-content-between align-items-center">
                <Headings text="Products" size="1.5rem" />
                <ActionButton
                  text={<>ADD +</>}
                  size="sm"
                  as={Link}
                  to="/products/add"
                  style={{ backgroundColor: "var(--bg-green-100)" }}
                />
              </div>
              {navigation.state === "loading" ? (
                <div className="text-center my-3">
                  <Spinner animation="border" size="sm" />
                </div>
              ) : (
                <>
                  <Table hover striped bordered responsive className="mt-5">
                    <thead>
                      <tr>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getProducts.map(
                        ({
                          name,
                          image,
                          _id,
                          slug,
                          price,
                          isActive,
                          inStock,
                        }) => (
                          <tr
                            key={_id}
                            className="small fw-medium"
                            title="click view to see more"
                          >
                            <td className="d-flex gap-3">
                              <LazyLoadImage
                                effect="blur"
                                src={image[0]}
                                alt="product images"
                                width={50}
                                height={50}
                                className="object-fit-fill"
                              />
                              <span>{name}</span>
                            </td>
                            <td>{formatCurrency(merchant?.currency, price)}</td>
                            <td
                              className={classnames({
                                "fw-bold": true,
                                "text-success": inStock,
                                "text-danger": !inStock,
                              })}
                            >
                              {inStock ? "IN STOCK" : "OUT OF STOCK"}{" "}
                            </td>
                            <td
                              className={classnames({
                                "fw-bold": true,
                                "text-success": isActive,
                                "text-info": !isActive,
                              })}
                            >
                              {isActive ? "ACTIVE" : "INACTIVE"}{" "}
                            </td>
                            <td>
                              <Badge
                                bg="danger"
                                text="light"
                                as={Link}
                                to={`/products/${slug}`}
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
                    page={page}
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
            <NoProducts />
          )}
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Products;
