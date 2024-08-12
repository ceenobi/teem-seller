import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "../styles.module.css";
import { userService } from "@/api";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";
import { handleError, validateFields } from "@/utils";
import { ActionButton, FormInputs, Texts } from "@/components";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

const ResetPassword = () => {
  const [reveal, setReveal] = useState(false);
  const [revealB, setRevealB] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const { userId, token } = useParams();

  const handleHide = () => {
    setReveal((prev) => !prev);
  };
  const handleHideB = () => {
    setRevealB((prev) => !prev);
  };

  const onFormSubmit = async (credentials) => {
    if (credentials.password !== credentials.confirmPassword) {
      toast.error("Password and Confirm Password do not match!");
      return;
    }
    try {
      const { status, data } = await userService.resetPassword(userId, token, {
        password: credentials.password,
      });
      if (status === 200) {
        toast.success(data.msg);
        navigate("/");
      }
    } catch (error) { 
      handleError(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset your password</title>
        <meta name="description" content="Fill in the fields to reset your password" />
      </Helmet>
      <Texts text="Reset your password" className="fw-bold" size="1.25rem" />
      <Form
        className={`${styles.form} mt-4 mx-auto`}
        onSubmit={handleSubmit(onFormSubmit)}
      >
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
        <div className="position-relative">
          <FormInputs
            type={revealB ? "text" : "password"}
            id="confirmPassword"
            label="Confirm Password(required)"
            placeholder="password"
            className="mb-3"
            name="confirmPassword"
            register={register}
            validateFields={validateFields?.confirmPassword}
            errors={errors.confirmPassword}
          />
          <Texts
            className="position-absolute top-50 end-0 translate-middle cursor"
            text={revealB ? <FaRegEyeSlash /> : <FaRegEye />}
            onClick={handleHideB}
          />
        </div>
        <ActionButton
          text="Reset"
          className="mt-3 w-100 btns"
          type="submit"
          pending={isSubmitting}
          disabled={isSubmitting}
        />
      </Form>
    </>
  );
};

export default ResetPassword;
