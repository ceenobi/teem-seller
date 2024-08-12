import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "../styles.module.css";
import { userService } from "@/api";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";
import { handleError, validateFields } from "@/utils";
import { ActionButton, FormInputs, Texts } from "@/components";
import { Helmet } from "react-helmet-async";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onFormSubmit = async (credentials) => {
    try {
      const { status, data } = await userService.forgotPassword(credentials);
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
        <title>Forgot user password</title>
        <meta name="description" content="Recover your password by giving us your email" />
      </Helmet>
      <Texts text="Recover your password" className="fw-bold" size="1.25rem" />
      <Form
        className={`${styles.form} mt-4 mx-auto`}
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
          errors={errors.email}
        />
        <ActionButton
          text="Recover"
          className="mt-3 w-100 btns"
          type="submit"
          pending={isSubmitting}
          disabled={isSubmitting}
        />
      </Form>
    </>
  );
};

export default ForgotPassword;
