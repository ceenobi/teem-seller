import { useStore } from "@/hooks";
import { useState } from "react";
import { Button, Image, Offcanvas } from "react-bootstrap";
import { IoMdAddCircle } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import Texts from "./Texts";
import { pageLinks, settingsLink } from "@/utils";
import classnames from "classnames";
import { IoLogOut } from "react-icons/io5";

const Drawer = () => {
  const [show, setShow] = useState(false);
  const { loggedInUser, merchant, logout } = useStore();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <TiThMenu
        size="30px"
        className="d-lg-none fw-bold iconBg"
        onClick={handleShow}
      />
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {loggedInUser ? `Hi ${loggedInUser.username}` : ""}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div
            className={` ${styles.innerSidebarBg} d-flex justify-content-between align-items-center p-2 w-100 rounded-3 border-0`}
          >
            {!merchant ? (
              <Link
                to="/merchant-new"
                className="d-flex gap-2 align-items-center py-2 text-white"
              >
                <IoMdAddCircle size="20px" className={`${styles.icon}`} />
                <span className="fs-6 fw-bold">Create merchant</span>
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
                onClick={handleClose}
              >
                <Icon size="1.5rem" color="#21394a" />
                <span>{name}</span>
              </Button>
            ))}
          </div>
          <hr/>
          <div>
            {settingsLink.map(({ id, label, path }) => (
              <Button
                as={Link}
                to={`${path}`}
                key={id}
                size="sm"
                variant="none"
                className={classnames({
                  "d-flex align-items-center gap-2 mb-1 w-100 text-uppercase fw-medium": true,
                  "rounded-3 border-0 activeSidebar px-2 py-3 fw-bold":
                    location.pathname === path,
                  "links px-2 py-3 rounded-3": location.pathname !== path,
                })}
                onClick={handleClose}
              >
                {label}
              </Button>
            ))}
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
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Drawer;
