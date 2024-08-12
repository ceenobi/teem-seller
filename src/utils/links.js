import { RiHome7Fill } from "react-icons/ri";
import { FaBagShopping } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { PiBagSimpleFill } from "react-icons/pi";
import { MdDiscount } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaFirstOrderAlt } from "react-icons/fa6";
import { MdLockClock } from "react-icons/md";
import { IoLockClosedSharp } from "react-icons/io5";

const pageLinks = [
  {
    id: 0,
    Icon: RiHome7Fill,
    name: "Getting Started",
    path: "/",
  },
  {
    id: 1,
    Icon: PiBagSimpleFill,
    name: "Orders",
    path: "/orders",
  },
  { id: 2, Icon: FaBagShopping, name: "Products", path: "/products" },
  {
    id: 3,
    Icon: BiSolidCategory,
    name: "Categories",
    path: "/categories",
  },
  {
    id: 4,
    Icon: BsFillPeopleFill,
    name: "Customers",
    path: "/customers",
  },
  {
    id: 5,
    Icon: MdDiscount,
    name: "Discounts",
    path: "/discounts",
  },
];

const settingsLink = [
  { label: "Merchant", path: "/merchant", id: 1 },
  { label: "Tax", path: "/tax", id: 2 },
  { label: "Shipping", path: "/shipping", id: 3 },
  { label: "Account", path: "/account", id: 4 },
];

const currency = [
  { label: "Select Currency", code: "Select Currency(required)", id: 0 },
  { label: "USD - Us.dollar", code: "USD", id: 1 },
  { label: "NGN - Nigerian naira", code: "NGN", id: 2 },
];

const state = [
  // { label: "Select State", code: "", id: 0 },
  { label: "Abia", code: "Abia", id: 1 },
  { label: "Abuja - FCT", code: "Abuja", id: 2 },
  { label: "Adamawa", code: "Adamawa", id: 3 },
  { label: "Akwa Ibom", code: "Akwa Ibom", id: 4 },
  { label: "Anambra", code: "Anambra", id: 5 },
  { label: "Lagos", code: "Lagos", id: 6 },
  { label: "Ogun", code: "Ogun", id: 7 },
];

const country = [
  { label: "Select Country", code: "Country (required)", id: 0 },
  { label: "Nigeria", code: "Nigeria", id: 1 },
];

const orderProgress = [
  {
    id: 0,
    Icon: FaFirstOrderAlt,
    name: "open",
  },
  {
    id: 1,
    Icon: MdLockClock,
    name: "processing",
  },
  {
    id: 2,
    Icon: IoLockClosedSharp,
    name: "fulfilled",
  },
];

export { pageLinks, settingsLink, currency, state, country, orderProgress };
