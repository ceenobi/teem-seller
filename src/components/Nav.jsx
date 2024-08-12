import { useStore } from "@/hooks";
import { settingsLink } from "@/utils";
import { Container, Dropdown, Image } from "react-bootstrap";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import Drawer from "./Drawer";

const Nav = () => {
  const { loggedInUser, logout } = useStore();
  return (
    <div className="bg-white">
      <Container
        fluid="xxl"
        className="d-flex justify-content-between justify-content-lg-end align-items-center p-3"
      >
        {/* mobile */}
        <Link className="d-flex d-lg-none gap-2 align-items-center" to="/">
          <RiShoppingBag2Fill
            size="40px"
            className="fw-bold iconBg"
            color="#1c956e"
          />
          <span className="fw-bold fs-3 text-black">TEEM</span>
        </Link>
        <Drawer />

        {/* desktop */}
        <Dropdown className="d-none d-lg-block">
          <Dropdown.Toggle
            variant="none"
            id="dropdown-basic"
            className="w-100 text-start"
          >
            <Image
              src={
                loggedInUser
                  ? loggedInUser?.photo
                  : "https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png"
              }
              roundedCircle
              className="object-fit-cover"
              style={{ width: "30px", height: "30px" }}
              alt="profilepic"
            />
            <span className="fw-bold mx-2">
              {loggedInUser ? loggedInUser?.username : "username"}
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {settingsLink.map(({ id, label, path }) => (
              <Dropdown.Item as={Link} to={`${path}`} key={id}>
                {label}
              </Dropdown.Item>
            ))}
            <Dropdown.Divider />
            <Dropdown.Item href="#" onClick={logout}>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </div>
  );
};

export default Nav;
