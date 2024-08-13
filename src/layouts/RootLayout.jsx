import { Sidebar, Nav, Texts } from "@/components";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <main>
      <div className="d-flex">
        <Sidebar />
        <Container fluid="xxl" className="p-0 outlet">
          <Nav />
          <div style={{ minHeight: "95dvh" }}>
            <Outlet />
          </div>
          <footer className="mx-4 py-2">
            <hr />
            <div className="d-flex align-items-center justify-content-between text-uppercase fw-bold">
              <Texts text={<>&copy;Teem platform, inc</>} size="12px" />
              <Texts text="documentation" size="12px" />
            </div>
          </footer>
        </Container>
      </div>
    </main>
  );
};

export default RootLayout;
