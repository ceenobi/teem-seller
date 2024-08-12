import { Button, Image } from "react-bootstrap";
import { pageLinks } from "@/utils";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { IoMdAddCircle } from "react-icons/io";
import classnames from "classnames";
import { IoLogOut } from "react-icons/io5";
import styles from "./styles.module.css";
import { useStore } from "@/hooks";
import Texts from "./Texts";

const Sidebar = () => {
  const location = useLocation();
  const { logout, merchant } = useStore();

  return (
    <div className="d-none d-lg-block shadow-sm p-4 sidebar">
      <div className={`py-3 ${styles.innerSidebar}`}>
        <div>
          <Link to="/">
            <RiShoppingBag2Fill
              size="3rem"
              className="fw-bold my-2 mx-auto"
              color="#1c956e"
            />
          </Link>
          <div
            className={` ${styles.innerSidebarBg} d-flex justify-content-between align-items-center p-2 w-100 rounded-3 border-0`}
          >
            {!merchant ? (
              <Link
                to="/merchant-new"
                className="d-flex gap-2 align-items-center py-2"
              >
                <IoMdAddCircle
                  size="20px"
                  className={`${styles.icon} text-white`}
                />
                <span className="fs-6 fw-bold text-white">Create merchant</span>
              </Link>
            ) : (
              <div className="d-flex gap-2 align-items-center">
                <Image
                  src={
                    merchant.logo
                      ? merchant.logo
                      : "https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png"
                  }
                  roundedCircle
                  style={{ width: "30px", height: "30px" }}
                  loading="lazy"
                />
                <div>
                  <Texts
                    text={merchant.merchantName}
                    className="fw-bold text-white mb-0 text-uppercase"
                    size="14px"
                  />
                  <span className="small text-white">
                    {merchant.merchantCode}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="mt-3 text-center overflow-auto">
            {pageLinks.map(({ id, Icon, name, path }) => (
              <Button
                key={id}
                as={Link}
                to={`${path}`}
                size="sm"
                variant="none"
                className={classnames({
                  "d-flex align-items-center gap-2 mb-1 w-100 text-uppercase fw-medium": true,
                  "rounded-3 border-0 activeSidebar px-2 py-3 fw-bold":
                    location.pathname === path,
                  "links px-2 py-3 rounded-3": location.pathname !== path,
                })}
              >
                <Icon size="1.5rem" color="#21394a" />
                <span>{name}</span>
              </Button>
            ))}
          </div>
        </div>
        <div>
          <hr />
          <div
            className="d-flex align-items-center gap-2 px-2 py-3 cursor links rounded-3"
            onClick={logout}
          >
            <IoLogOut size="1.5rem" color="#21394a" />{" "}
            <span className="fw-medium text-uppercase fs-">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
