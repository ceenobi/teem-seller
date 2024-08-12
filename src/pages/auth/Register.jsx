import { ActionButton, FormInputs, Headings, Texts } from "@/components";
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

const Register = () => {
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

  const handleHide = () => {
    setReveal((prev) => !prev);
  };

  const onFormSubmit = async (credentials) => {
    try {
      const { status, data } = await userService.register(credentials);
      if (status === 201) {
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
        <title>Register to Teem platform</title>
        <meta name="description" content="Become a merchant and start selling" />
      </Helmet>
      <Headings
        text="Create your free account"
        color="var(--bg-green-100)"
        size="1.875rem"
      />
      <Texts
        text="Start selling in 5 minutes"
        className="fw-bold"
        size="1.25rem"
        color="var(--bg-sky-950)"
      />
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
        <FormInputs
          type="email"
          id="email"
          label="Email(required)"
          placeholder="email"
          className="mb-3"
          name="email"
          register={register}
          validateFields={validateFields?.email}
          errors={errors.email}
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
          text="Create your account"
          className="mt-3 w-100 btns"
          type="submit"
          pending={isSubmitting}
          disabled={isSubmitting}
        />
        <div className="mt-3">
          <Form.Text>
            Already have an account?{" "}
            <span className="fw-bold">
              <Link to="/authorize/login" className="text-success">
                Login
              </Link>
            </span>
          </Form.Text>
        </div>
      </Form>
    </>
  );
};

export default Register;
