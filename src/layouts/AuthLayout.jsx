import { Outlet, useLocation, Link } from "react-router-dom";
import { RiShoppingBag2Fill } from "react-icons/ri";
import styles from "./styles.module.css";
import stylesForm from "../pages/styles.module.css"
import { ActionButton, FormInputs, Headings, Texts } from "@/components";
import { useForm } from "react-hook-form";
import { Container, Form } from "react-bootstrap";
import { handleError, validateFields } from "@/utils";
import { userService } from "@/api";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const AuthLayout = () => {
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onFormSubmit = async (credentials) => {
    try {
      const { status, data } = await userService.loginViaEmail(credentials);
      if (status === 200) {
        toast.success(data.msg);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
     <><Helmet>
      <title>Welcome to Teem</title>
      <meta
        name="description"
        content="Get started" />
    </Helmet><Container fluid className="d-lg-flex p-0">
        <div
          className={`${styles.authBg} min-vh-100 d-flex flex-column justify-content-center align-items-center text-center px-4`}
        >
          <Link to="/">
            <RiShoppingBag2Fill
              size="3rem"
              className="fw-bold mb-2 mx-auto"
              color="#1c956e" />
          </Link>
          {location.pathname === "/authorize" ? (
            <>
              <Texts
                text="Lets get you back in"
                className="fw-bold"
                size="1.25rem"
                color="var(--bg-sky-950)" />
              <Form
                className={`${stylesForm.form} mt-4 mx-auto`}
                onSubmit={handleSubmit(onFormSubmit)}
              >
                <FormInputs
                  type="email"
                  id="email"
                  label="Email(required)"
                  placeholder="email"
                  className="mb-3"
                  name="email"
                  register={register}
                  validateFields={validateFields?.email}
                  errors={errors.email} />

                <ActionButton
                  text="Sign in by email"
                  className="mb-3 w-100 btns"
                  type="submit"
                  pending={isSubmitting}
                  disabled={isSubmitting} />
                <Form.Text id="email" muted>
                  We’ll email you a magic link for a password-free sign in. Or you
                  can
                  <span className="fw-bold mx-1">
                    <Link to="/authorize/login" className="text-success">
                      sign in
                    </Link>
                  </span>
                  manually instead.
                </Form.Text>
              </Form>
            </>
          ) : (
            <Outlet />
          )}
        </div>
        <div
          className={`${styles.authBgInfo} d-flex flex-column align-items-center justify-content-center p-4 `}
        >
          <div className="mx-auto">
            <div className="d-flex align-items-center justify-content-center">
              <hr className="w-50 text-black" />
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
              <hr className="w-50 text-black" />
            </div>
            <div className="bg-white p-4 shadow-md rounded-3 mb-4 ">
              <Headings text="Take ownership over your commerce" size="1.5rem" />
              <Texts
                text={<>
                  <span className="fw-bold">TEEM.js</span> is a flexible
                  commerce engine that gives sellers the abilty to manage their
                  products effortlessly.
                </>} />
              <Texts
                text="Build your store front using our backend api and let TEEM help manage it for you."
                size="0.9rem" />
              <div className="d-flex mt-4">
                <ActionButton
                  text="Start for free"
                  size="lg"
                  style={{ backgroundColor: "var(--bg-green-100)" }}
                  as={Link}
                  to="/authorize/register"
                  className="rounnded-1" />
              </div>
            </div>
          </div>
        </div>
      </Container></>
  );
};

export default AuthLayout;
