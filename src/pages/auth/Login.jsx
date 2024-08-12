import { ActionButton, FormInputs, Texts } from "@/components";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import styles from "../styles.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { handleError, validateFields } from "@/utils";
import { userService } from "@/api";
import { toast } from "react-toastify";
import { useStore } from "@/hooks";
import { Helmet } from "react-helmet-async";

const Login = () => {
  const [reveal, setReveal] = useState(false);
  const { setToken } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  //toggle password
  const handleHide = () => {
    setReveal((prev) => !prev);
  };

  const onFormSubmit = async (credentials) => {
    try {
      const { status, data } = await userService.login(credentials);
      if (status === 200) {
        toast.success(data.msg);
        setToken(data.accessToken);
        navigate(from);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login to Teem platform</title>
        <meta name="description" content="Get right back in" />
      </Helmet>
      <Texts text="Login to Teem Platform" className="fw-bold" size="1.25rem" />
      <Form
        className={`${styles.form} mt-4 mx-auto`}
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <FormInputs
          type="text"
          id="username"
          label="Username(required)"
          placeholder="username"
          className="mb-3"
          name="username"
          register={register}
          validateFields={validateFields?.username}
          errors={errors.username}
        />
        <div className="position-relative">
          <FormInputs
            type={reveal ? "text" : "password"}
            id="password"
            label="Password(required)"
            placeholder="password"
            className="mb-3"
            name="password"
            register={register}
            validateFields={validateFields?.password}
            errors={errors.password}
          />
          <Texts
            className="position-absolute top-50 end-0 translate-middle cursor"
            text={reveal ? <FaRegEyeSlash /> : <FaRegEye />}
            onClick={handleHide}
          />
        </div>
        <ActionButton
          text="Login"
          className="mt-3 w-100 btns"
          type="submit"
          pending={isSubmitting}
          disabled={isSubmitting}
        />
        <div className="mt-3 d-flex justify-content-between align-items-center">
          <Form.Text className="fw-medium">
            <Link to="/authorize/forgot-password" className="text-black">
              Forgot password?
            </Link>
          </Form.Text>
          <Form.Text>
            New here?{" "}
            <span>
              <Link to="/authorize/register" className="text-success fw-bold">
                Sign up
              </Link>
            </span>
          </Form.Text>
        </div>
      </Form>
    </>
  );
};

export default Login;
