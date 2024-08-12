import { Error, Loading } from "@/components";
import { Suspense, lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import {
  Account,
  CreateMerchant,
  ForgotPassword,
  Login,
  Register,
  ResetPassword,
  LoginByMail,
  Merchant,
  Tax,
  EditTax,
  Shipping,
  EditShipping,
  Categories,
  AddCategory,
  EditCategory,
  Products,
  AddProduct,
  EditProduct,
  Discounts,
  AddDiscount,
  EditDiscount,
  Customers,
  CustomerOrders,
  Home,
  Orders,
  OrderDetail,
} from "@/pages";
import { PrivateRoutes, PublicRoutes, MerchantRoutes } from "@/routes";
import { useStore } from "@/hooks";
import {
  categoryService,
  customerService,
  discountService,
  merchantService,
  orderService,
  productService,
  shippingService,
  taxService,
  userService,
} from "@/api";
import { toast } from "react-toastify";

//lazyload rootlayout
const RootLayout = lazy(() => import("@/layouts/RootLayout"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const PageNotFound = lazy(() => import("@/components/PageNotFound"));

const AppRoutes = () => {
  const { token, merchant, loggedInUser, page, customerPage, orderPage } =
    useStore();

  const routes = [
    {
      path: "/",
      element: (
        <Suspense fallback={<Loading />}>
          <PrivateRoutes isAuth={token}>
            <RootLayout />
          </PrivateRoutes>
        </Suspense>
      ),
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Home />,
          loader: async () => {
            if (!merchant) {
              return null;
            }
            return await merchantService.merchantSales(
              merchant?.merchantCode,
              token
            );
          },
        },
        {
          path: "account",
          element: <Account />,
        },
        {
          path: "merchant",
          element: (
            <MerchantRoutes role={loggedInUser?.role}>
              <Merchant />
            </MerchantRoutes>
          ),
        },
        {
          path: "tax",
          element: (
            <MerchantRoutes role={loggedInUser?.role}>
              <Tax />
            </MerchantRoutes>
          ),
          loader: async () =>
            await taxService.getAllTax(merchant?.merchantCode),
          children: [
            {
              path: ":taxId",
              element: <EditTax />,
              loader: async ({ params }) =>
                await taxService.getASingleTax(
                  merchant?.merchantCode,
                  params.taxId
                ),
            },
          ],
        },
        {
          path: "shipping",
          element: (
            <MerchantRoutes role={loggedInUser?.role}>
              <Shipping />
            </MerchantRoutes>
          ),
          loader: async () => {
            if (loggedInUser?.role !== "seller") {
              toast.error("Unauthorized! You are not a merchant yet.", {
                toastId: "unauthorized",
              });
              return null;
            }
            return await shippingService.getAllShipping(merchant?.merchantCode);
          },
          children: [
            {
              path: ":shippingId",
              element: <EditShipping />,
              loader: async ({ params }) =>
                await shippingService.getShipping(
                  merchant?.merchantCode,
                  params.shippingId
                ),
            },
          ],
        },
        {
          path: "categories",
          element: (
            <MerchantRoutes role={loggedInUser?.role}>
              <Categories />
            </MerchantRoutes>
          ),
          loader: async () => {
            if (loggedInUser?.role !== "seller") {
              toast.error("Unauthorized! You are not a merchant yet.", {
                toastId: "unauthorized",
              });
              return null;
            }
            return await categoryService.getAllCategories(
              merchant?.merchantCode
            );
          },
          children: [
            {
              path: "add",
              element: <AddCategory />,
            },
            {
              path: ":categoryId",
              element: <EditCategory />,
              loader: async ({ params }) =>
                await categoryService.getACategory(
                  merchant?.merchantCode,
                  params.categoryId
                ),
            },
          ],
        },
        {
          path: "products",
          element: (
            <MerchantRoutes role={loggedInUser?.role}>
              <Products />
            </MerchantRoutes>
          ),
          loader: async () => {
            if (loggedInUser?.role !== "seller") {
              toast.error("Unauthorized! You are not a merchant yet.", {
                toastId: "unauthorized",
              });
              return null;
            }
            return await productService.getAllProducts(
              merchant?.merchantCode,
              page
            );
          },
          children: [
            { path: "add", element: <AddProduct /> },
            {
              path: ":slug",
              element: <EditProduct />,
              loader: async ({ params }) =>
                await productService.getAProduct(
                  merchant?.merchantCode,
                  params.slug
                ),
            },
          ],
        },
        {
          path: "discounts",
          element: (
            <MerchantRoutes role={loggedInUser?.role}>
              <Discounts />
            </MerchantRoutes>
          ),
          loader: async () => {
            if (loggedInUser?.role !== "seller") {
              toast.error("Unauthorized! You are not a merchant yet.", {
                toastId: "unauthorized",
              });
              return null;
            }
            return await discountService.getAllDiscounts(
              merchant?.merchantCode
            );
          },
          children: [
            { path: "add", element: <AddDiscount /> },
            {
              path: ":discountId",
              element: <EditDiscount />,
              loader: async ({ params }) =>
                await discountService.getADiscount(
                  merchant?.merchantCode,
                  params.discountId
                ),
            },
          ],
        },
        {
          path: "customers",
          element: (
            <MerchantRoutes role={loggedInUser?.role}>
              <Customers />
            </MerchantRoutes>
          ),
          loader: async () => {
            if (loggedInUser?.role !== "seller") {
              toast.error("Unauthorized! You are not a merchant yet.", {
                toastId: "unauthorized",
              });
              return null;
            }
            return await customerService.getAllCustomers(
              merchant?.merchantCode,
              customerPage
            );
          },
          children: [
            {
              path: ":username",
              element: <CustomerOrders />,
              loader: async ({ params }) =>
                await customerService.getACustomer(
                  merchant?.merchantCode,
                  params.username
                ),
            },
          ],
        },
        {
          path: "orders",
          element: (
            <MerchantRoutes role={loggedInUser?.role}>
              <Orders />
            </MerchantRoutes>
          ),
          loader: async () => {
            if (loggedInUser?.role !== "seller") {
              toast.error("Unauthorized! You are not a merchant yet.", {
                toastId: "unauthorized",
              });
              return null;
            }
            return await orderService.getAllOrders(
              merchant?.merchantCode,
              orderPage
            );
          },
          children: [
            {
              path: ":orderId",
              element: <OrderDetail />,
              loader: async ({ params }) =>
                await orderService.getAnOrder(
                  merchant?.merchantCode,
                  params.orderId
                ),
            },
          ],
        },
      ],
    },
    {
      path: "authorize",
      element: (
        <Suspense fallback={<Loading />}>
          <PublicRoutes isAuth={token}>
            <AuthLayout />
          </PublicRoutes>
        </Suspense>
      ),
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: ":userId/:loginCode",
          element: <LoginByMail />,
          errorElement: <Error />,
          loader: async ({ params }) =>
            await userService.verifyLoginEmailLink(
              params.userId,
              params.loginCode
            ),
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "reset-password/:userId/:token",
          element: <ResetPassword />,
        },
      ],
    },
    {
      path: "merchant-new",
      element: (
        <Suspense fallback={<Loading />}>
          <PrivateRoutes isAuth={token}>
            {merchant ? <Navigate to="/" replace /> : <CreateMerchant />}
          </PrivateRoutes>
        </Suspense>
      ),
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<Loading />}>
          <PageNotFound />
        </Suspense>
      ),
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
